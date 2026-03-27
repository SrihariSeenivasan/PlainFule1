import { Router } from 'express';
import { createMessage, getMessages, getMessageById, updateMessageStatus, deleteMessage } from '../controllers/contactController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Public route to submit message
router.post('/', createMessage);

// Admin-only routes (need auth first to populate req.user, then check admin role)
router.get('/', authMiddleware, adminMiddleware, getMessages);
router.get('/:id', authMiddleware, adminMiddleware, getMessageById);
router.put('/:id', authMiddleware, adminMiddleware, updateMessageStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteMessage);

export default router;
