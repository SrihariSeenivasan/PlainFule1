import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import {
  getCustomerReviews,
  getAdminCustomerReviews,
  createCustomerReview,
  updateCustomerReview,
  deleteCustomerReview,
  getVideoReviews,
  getAdminVideoReviews,
  createVideoReview,
  updateVideoReview,
  deleteVideoReview,
  getDoctorReviews,
  getAdminDoctorReviews,
  createDoctorReview,
  updateDoctorReview,
  deleteDoctorReview,
} from '../controllers/testimonialController';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB per file
});

// Multer error handler middleware
const multerErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({ error: 'File size exceeds 50MB limit' });
      return;
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({ error: 'Too many files' });
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

// Wrapper for async route handlers
const asyncHandler = (fn: (req: Request | AuthRequest, res: Response, next?: NextFunction) => Promise<unknown>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// ── PUBLIC ENDPOINTS ──

// Get all active customer reviews
router.get('/customer-reviews', asyncHandler(getCustomerReviews));

// Get all active video reviews
router.get('/video-reviews', asyncHandler(getVideoReviews));

// ── ADMIN ENDPOINTS (Protected) ──

// Customer Reviews
router.get('/admin/customer-reviews', authMiddleware, asyncHandler(getAdminCustomerReviews));
router.post('/admin/customer-reviews', authMiddleware, upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'avatarImage', maxCount: 1 }]), multerErrorHandler, asyncHandler(createCustomerReview));
router.put('/admin/customer-reviews/:id', authMiddleware, upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'avatarImage', maxCount: 1 }]), multerErrorHandler, asyncHandler(updateCustomerReview));
router.delete('/admin/customer-reviews/:id', authMiddleware, asyncHandler(deleteCustomerReview));

// Video Reviews
router.get('/admin/video-reviews', authMiddleware, asyncHandler(getAdminVideoReviews));
router.post('/admin/video-reviews', authMiddleware, upload.single('thumbnailImage'), multerErrorHandler, asyncHandler(createVideoReview));
router.put('/admin/video-reviews/:id', authMiddleware, upload.single('thumbnailImage'), multerErrorHandler, asyncHandler(updateVideoReview));
router.delete('/admin/video-reviews/:id', authMiddleware, asyncHandler(deleteVideoReview));

// Doctor Reviews
router.get('/doctor-reviews', asyncHandler(getDoctorReviews));
router.get('/admin/doctor-reviews', authMiddleware, asyncHandler(getAdminDoctorReviews));
router.post('/admin/doctor-reviews', authMiddleware, upload.single('image'), multerErrorHandler, asyncHandler(createDoctorReview));
router.put('/admin/doctor-reviews/:id', authMiddleware, upload.single('image'), multerErrorHandler, asyncHandler(updateDoctorReview));
router.delete('/admin/doctor-reviews/:id', authMiddleware, asyncHandler(deleteDoctorReview));

export default router;
