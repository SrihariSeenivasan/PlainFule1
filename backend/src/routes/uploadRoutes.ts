import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import * as uploadController from '../controllers/uploadController';

const router = Router();

// Configure multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

// Multer error handler middleware
const multerErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'File size exceeds 10MB limit' });
      return;
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({ error: 'Maximum 5 files allowed' });
      return;
    }
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof Error) {
    res.status(400).json({ error: err.message });
    return;
  }
  next();
};

// Upload images route with error handling
router.post(
  '/',
  upload.array('images', 5),
  multerErrorHandler,
  uploadController.uploadImages
);

export default router;
