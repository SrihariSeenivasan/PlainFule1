import { Router } from 'express';
import { authMiddleware, userMiddleware } from '../middleware/auth';
import * as faqController from '../controllers/faqController';

const router = Router();

// Public routes - anyone can view FAQs
router.get('/', faqController.getFAQs);
router.get('/:id', faqController.getFAQById);

// Admin only routes - authentication required
router.use(authMiddleware);
router.use(userMiddleware);

router.post('/', faqController.createFAQ);
router.put('/:id', faqController.updateFAQ);
router.delete('/:id', faqController.deleteFAQ);

export default router;
