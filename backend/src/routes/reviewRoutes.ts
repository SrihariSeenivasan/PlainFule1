import { Router } from 'express';
import { authMiddleware, userMiddleware } from '../middleware/auth';
import * as reviewController from '../controllers/reviewController';

const router = Router();

// Public routes - anyone can view reviews
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/stats/:productId', reviewController.getReviewStats);

// Authenticated routes
router.post('/', authMiddleware, userMiddleware, reviewController.createReview);
router.put('/:id', authMiddleware, userMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, userMiddleware, reviewController.deleteReview);

export default router;
