import { Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AppError } from '../middleware/errorHandler';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';
const S3_BASE_URL = process.env.AWS_S3_BASE_URL || `https://${BUCKET_NAME}.s3.amazonaws.com`;

export const uploadImages = async (req: Request, res: Response) => {
  try {
    console.log('[Upload] Request received', {
      bucketConfigured: !!BUCKET_NAME,
      filesCount: req.files ? (Array.isArray(req.files) ? req.files.length : 1) : 0,
      region: process.env.AWS_REGION,
    });

    // Validate S3 configuration
    if (!BUCKET_NAME || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('[Upload] S3 configuration missing', {
        bucket: !!BUCKET_NAME,
        accessKey: !!process.env.AWS_ACCESS_KEY_ID,
        secretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
      });
      throw new AppError(500, 'Server not properly configured for uploads');
    }

    // Check if files are present
    if (!req.files) {
      console.error('[Upload] No files provided in request');
      throw new AppError(400, 'No files provided');
    }

    // Handle both single file and multiple files
    let files: Express.Multer.File[] = [];
    if (Array.isArray(req.files)) {
      files = req.files;
    } else if (req.files.images) {
      files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    }

    if (files.length === 0) {
      console.error('[Upload] Files array is empty after parsing');
      throw new AppError(400, 'No files provided');
    }

    if (files.length > MAX_FILES) {
      throw new AppError(400, `Maximum ${MAX_FILES} images allowed`);
    }

    console.log('[Upload] Processing', files.length, 'files');
    const urls: string[] = [];

    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new AppError(400, `File "${file.originalname}" exceeds the 10 MB limit`);
      }

      // Detect file extension from mimetype or original name
      const mimetypeMap: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/svg+xml': 'svg',
        'image/gif': 'gif'
      };
      
      const ext = mimetypeMap[file.mimetype] || file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
      
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        throw new AppError(400, `File type ".${ext}" is not allowed`);
      }

      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).slice(2);
      const filename = `products/${timestamp}-${random}.${ext}`;

      // Upload to S3
      try {
        console.log('[Upload] Uploading to S3:', { bucket: BUCKET_NAME, key: filename });
        await s3Client.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: file.buffer,
            ContentType: file.mimetype || 'application/octet-stream',
            CacheControl: 'max-age=31536000', // Cache for 1 year
          })
        );

        // Construct the full URL
        const url = `${S3_BASE_URL}/${filename}`;
        urls.push(url);
        console.log('[Upload] Successfully uploaded:', url);
      } catch (uploadErr) {
        console.error('[Upload] S3 upload error for file:', file.originalname, uploadErr);
        throw new AppError(500, `Failed to upload "${file.originalname}" to storage`);
      }
    }

    console.log('[Upload] Success:', { uploadedCount: urls.length });
    res.json({ urls });
  } catch (err) {
    if (err instanceof AppError) {
      console.error('[Upload] AppError:', err.statusCode, err.message);
      throw err;
    }
    console.error('[Upload] Unexpected error:', err);
    throw new AppError(500, 'Upload failed');
  }
};
