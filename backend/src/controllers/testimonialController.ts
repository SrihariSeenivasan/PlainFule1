import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client (same as uploadController)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';
const S3_BASE_URL = process.env.AWS_S3_BASE_URL || `https://${BUCKET_NAME}.s3.amazonaws.com`;

// ── HELPER FUNCTIONS ──

// Upload image to S3
const uploadToS3 = async (file: Express.Multer.File, folder: string = 'testimonials'): Promise<string> => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2);
  const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${folder}/${timestamp}-${random}.${ext}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype || 'application/octet-stream',
      CacheControl: 'max-age=31536000',
    })
  );

  return `${S3_BASE_URL}/${filename}`;
};

// Delete file from S3
const deleteFromS3 = async (url: string): Promise<void> => {
  try {
    const key = url.replace(S3_BASE_URL + '/', '');
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );
  } catch (err: unknown) {
    console.error('Error deleting from S3:', err);
  }
};

// ── CUSTOMER REVIEWS ──

// Get all customer reviews (public - active only)
export const getCustomerReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.customerReview.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { displayOrder: 'asc' },
      include: {
        creator: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    res.json(reviews);
  } catch {
    throw new AppError(500, 'Failed to fetch customer reviews');
  }
};

// Get all customer reviews (admin view - all statuses)
export const getAdminCustomerReviews = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [reviews, total] = await Promise.all([
      prisma.customerReview.findMany({
        where,
        include: {
          creator: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { displayOrder: 'asc' },
        skip,
        take: limit,
      }),
      prisma.customerReview.count({ where }),
    ]);

    res.json({
      data: reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    throw new AppError(500, 'Failed to fetch customer reviews');
  }
};

// Create customer review
export const createCustomerReview = async (req: Request, res: Response) => {
  try {
    const { category, name, location, quote, rating, status } = req.body;
    const userId = (req as unknown as { user?: { id: number } }).user?.id;

    if (!userId) {
      throw new AppError(401, 'Unauthorized');
    }

    if (!category || !name || !location || !quote || !rating) {
      throw new AppError(400, 'Missing required fields');
    }

    let mainImage = '';
    let avatarImage = '';

    // Upload main image
    if (req.files && 'mainImage' in req.files && req.files.mainImage) {
      const files = Array.isArray(req.files.mainImage)
        ? req.files.mainImage
        : [req.files.mainImage];
      mainImage = await uploadToS3(files[0], 'testimonials/customer');
    }

    // Upload avatar image
    if (req.files && 'avatarImage' in req.files && req.files.avatarImage) {
      const files = Array.isArray(req.files.avatarImage)
        ? req.files.avatarImage
        : [req.files.avatarImage];
      avatarImage = await uploadToS3(files[0], 'testimonials/avatars');
    }

    // Get the highest displayOrder to append new review
    const lastReview = await prisma.customerReview.findFirst({
      orderBy: { displayOrder: 'desc' },
    });
    const displayOrder = (lastReview?.displayOrder || 0) + 1;

    const review = await prisma.customerReview.create({
      data: {
        category,
        name,
        location,
        quote,
        rating: parseInt(rating),
        mainImage,
        avatarImage,
        status: status || 'PENDING',
        displayOrder,
        createdBy: userId,
      },
      include: {
        creator: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    res.status(201).json(review);
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;
    console.error('Create customer review error:', err);
    throw new AppError(500, `Failed to create customer review: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

// Update customer review
export const updateCustomerReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category, name, location, quote, rating, status, displayOrder } = req.body;

    const review = await prisma.customerReview.findUnique({ where: { id: parseInt(id) } });

    if (!review) {
      throw new AppError(404, 'Customer review not found');
    }

    let mainImage = review.mainImage;
    let avatarImage = review.avatarImage;

    // Upload new main image if provided
    if (req.files && 'mainImage' in req.files && req.files.mainImage) {
      if (review.mainImage) {
        await deleteFromS3(review.mainImage);
      }
      const files = Array.isArray(req.files.mainImage)
        ? req.files.mainImage
        : [req.files.mainImage];
      mainImage = await uploadToS3(files[0], 'testimonials/customer');
    }

    // Upload new avatar image if provided
    if (req.files && 'avatarImage' in req.files && req.files.avatarImage) {
      if (review.avatarImage) {
        await deleteFromS3(review.avatarImage);
      }
      const files = Array.isArray(req.files.avatarImage)
        ? req.files.avatarImage
        : [req.files.avatarImage];
      avatarImage = await uploadToS3(files[0], 'testimonials/avatars');
    }

    const updatedReview = await prisma.customerReview.update({
      where: { id: parseInt(id) },
      data: {
        category: category || review.category,
        name: name || review.name,
        location: location || review.location,
        quote: quote || review.quote,
        rating: rating ? parseInt(rating) : review.rating,
        mainImage,
        avatarImage,
        status: status || review.status,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : review.displayOrder,
      },
      include: {
        creator: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    res.json(updatedReview);
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;
    console.error('Update customer review error:', err);
    throw new AppError(500, 'Failed to update customer review');
  }
};

// Delete customer review
export const deleteCustomerReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await prisma.customerReview.findUnique({ where: { id: parseInt(id) } });

    if (!review) {
      throw new AppError(404, 'Customer review not found');
    }

    // Delete images from S3
    if (review.mainImage) {
      await deleteFromS3(review.mainImage);
    }
    if (review.avatarImage) {
      await deleteFromS3(review.avatarImage);
    }

    await prisma.customerReview.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Customer review deleted successfully' });
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;
    throw new AppError(500, 'Failed to delete customer review');
  }
};

// ── VIDEO REVIEWS ──

// Get all video reviews (public - active only)
export const getVideoReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.videoReview.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { displayOrder: 'asc' },
      include: {
        creator: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    res.json(reviews);
  } catch {
    throw new AppError(500, 'Failed to fetch video reviews');
  }
};

// Get all video reviews (admin view - all statuses)
export const getAdminVideoReviews = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [reviews, total] = await Promise.all([
      prisma.videoReview.findMany({
        where,
        include: {
          creator: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { displayOrder: 'asc' },
        skip,
        take: limit,
      }),
      prisma.videoReview.count({ where }),
    ]);

    res.json({
      data: reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    throw new AppError(500, 'Failed to fetch video reviews');
  }
};

// Create video review
export const createVideoReview = async (req: Request, res: Response) => {
  try {
    const { name, role, quote, rating, videoUrl, status } = req.body;
    const userId = (req as unknown as { user?: { id: number } }).user?.id;

    console.log('[VideoReview] Creating review:', { name, role, hasFile: !!req.file, videoUrl, userId });

    if (!userId) {
      throw new AppError(401, 'Unauthorized');
    }

    if (!name || !role || !quote || !rating) {
      throw new AppError(400, 'Missing required fields');
    }

    let thumbnailImage = '';

    // Upload thumbnail image (req.file from multer.single())
    if (req.file) {
      console.log('[VideoReview] Uploading thumbnail:', req.file.originalname);
      thumbnailImage = await uploadToS3(req.file, 'testimonials/video');
      console.log('[VideoReview] Thumbnail uploaded:', thumbnailImage);
    }

    // Get the highest displayOrder to append new review
    const lastReview = await prisma.videoReview.findFirst({
      orderBy: { displayOrder: 'desc' },
    });
    const displayOrder = (lastReview?.displayOrder || 0) + 1;

    const review = await prisma.videoReview.create({
      data: {
        name,
        role,
        quote,
        rating: parseInt(rating),
        thumbnailImage,
        videoUrl: videoUrl || null,
        status: status || 'PENDING',
        displayOrder,
        createdBy: userId,
      },
      include: {
        creator: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    console.log('[VideoReview] Create successful:', review.id);
    res.status(201).json(review);
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error('[VideoReview] AppError:', err.statusCode, err.message);
      throw err;
    }
    console.error('[VideoReview] Create failed:', err);
    throw new AppError(500, `Failed to create video review: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

// Update video review
export const updateVideoReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, quote, rating, videoUrl, status, displayOrder } = req.body;

    console.log('[VideoReview] Updating review:', { id, name, role, hasFile: !!req.file, videoUrl });

    const review = await prisma.videoReview.findUnique({ where: { id: parseInt(id) } });

    if (!review) {
      throw new AppError(404, 'Video review not found');
    }

    let thumbnailImage = review.thumbnailImage;

    // Upload new thumbnail image if provided (req.file from multer.single())
    if (req.file) {
      console.log('[VideoReview] Uploading thumbnail:', req.file.originalname);
      if (review.thumbnailImage) {
        await deleteFromS3(review.thumbnailImage);
      }
      thumbnailImage = await uploadToS3(req.file, 'testimonials/video');
      console.log('[VideoReview] Thumbnail uploaded:', thumbnailImage);
    }

    const updatedReview = await prisma.videoReview.update({
      where: { id: parseInt(id) },
      data: {
        name: name || review.name,
        role: role || review.role,
        quote: quote || review.quote,
        rating: rating ? parseInt(rating) : review.rating,
        thumbnailImage,
        videoUrl: videoUrl || review.videoUrl,
        status: status || review.status,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : review.displayOrder,
      },
      include: {
        creator: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    console.log('[VideoReview] Update successful:', updatedReview.id);
    res.json(updatedReview);
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error('[VideoReview] AppError:', err.statusCode, err.message);
      throw err;
    }
    console.error('[VideoReview] Update failed:', err);
    throw new AppError(500, `Failed to update video review: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

// Delete video review
export const deleteVideoReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await prisma.videoReview.findUnique({ where: { id: parseInt(id) } });

    if (!review) {
      throw new AppError(404, 'Video review not found');
    }

    // Delete image from S3
    if (review.thumbnailImage) {
      await deleteFromS3(review.thumbnailImage);
    }

    await prisma.videoReview.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Video review deleted successfully' });
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;
    throw new AppError(500, 'Failed to delete video review');
  }
};

// ── DOCTOR REVIEWS ──

// Get all doctor reviews (public - active only)
export const getDoctorReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.doctorReview.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { displayOrder: 'asc' },
      include: {
        creator: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    res.json(reviews);
  } catch {
    throw new AppError(500, 'Failed to fetch doctor reviews');
  }
};

// Get all doctor reviews (admin view - all statuses)
export const getAdminDoctorReviews = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [reviews, total] = await Promise.all([
      prisma.doctorReview.findMany({
        where,
        include: {
          creator: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { displayOrder: 'asc' },
        skip,
        take: limit,
      }),
      prisma.doctorReview.count({ where }),
    ]);

    res.json({
      data: reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    throw new AppError(500, 'Failed to fetch doctor reviews');
  }
};

// Create doctor review
export const createDoctorReview = async (req: Request, res: Response) => {
  try {
    const { name, title, quote, rating, status } = req.body;
    const userId = (req as unknown as { user?: { id: number } }).user?.id;

    console.log('[DoctorReview] Creating review:', { name, title, hasFile: !!req.file, userId });

    if (!userId) {
      throw new AppError(401, 'Unauthorized');
    }

    if (!name || !title || !quote || !rating) {
      throw new AppError(400, 'Missing required fields');
    }

    let image = '';

    // Upload image
    if (req.file) {
      console.log('[DoctorReview] Uploading image:', req.file.originalname);
      image = await uploadToS3(req.file, 'testimonials/doctors');
      console.log('[DoctorReview] Image uploaded:', image);
    }

    // Get the highest displayOrder to append new review
    const lastReview = await prisma.doctorReview.findFirst({
      orderBy: { displayOrder: 'desc' },
    });
    const displayOrder = (lastReview?.displayOrder || 0) + 1;

    const review = await prisma.doctorReview.create({
      data: {
        name,
        title,
        quote,
        rating: parseInt(rating),
        image,
        status: status || 'PENDING',
        displayOrder,
        createdBy: userId,
      },
      include: {
        creator: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    console.log('[DoctorReview] Create successful:', review.id);
    res.status(201).json(review);
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error('[DoctorReview] AppError:', err.statusCode, err.message);
      throw err;
    }
    console.error('[DoctorReview] Create failed:', err);
    throw new AppError(500, `Failed to create doctor review: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

// Update doctor review
export const updateDoctorReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, title, quote, rating, status, displayOrder } = req.body;

    console.log('[DoctorReview] Updating review:', { id, name, title, hasFile: !!req.file });

    const review = await prisma.doctorReview.findUnique({ where: { id: parseInt(id) } });

    if (!review) {
      throw new AppError(404, 'Doctor review not found');
    }

    let image = review.image;

    // Upload new image if provided
    if (req.file) {
      console.log('[DoctorReview] Uploading image:', req.file.originalname);
      if (review.image) {
        await deleteFromS3(review.image);
      }
      image = await uploadToS3(req.file, 'testimonials/doctors');
      console.log('[DoctorReview] Image uploaded:', image);
    }

    const updatedReview = await prisma.doctorReview.update({
      where: { id: parseInt(id) },
      data: {
        name: name || review.name,
        title: title || review.title,
        quote: quote || review.quote,
        rating: rating ? parseInt(rating) : review.rating,
        image,
        status: status || review.status,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : review.displayOrder,
      },
      include: {
        creator: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    console.log('[DoctorReview] Update successful:', updatedReview.id);
    res.json(updatedReview);
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error('[DoctorReview] AppError:', err.statusCode, err.message);
      throw err;
    }
    console.error('[DoctorReview] Update failed:', err);
    throw new AppError(500, `Failed to update doctor review: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

// Delete doctor review
export const deleteDoctorReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await prisma.doctorReview.findUnique({ where: { id: parseInt(id) } });

    if (!review) {
      throw new AppError(404, 'Doctor review not found');
    }

    // Delete image from S3
    if (review.image) {
      await deleteFromS3(review.image);
    }

    await prisma.doctorReview.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Doctor review deleted successfully' });
  } catch (err: unknown) {
    if (err instanceof AppError) throw err;
    throw new AppError(500, 'Failed to delete doctor review');
  }
};
