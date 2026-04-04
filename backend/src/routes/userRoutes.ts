import { Router } from 'express';
import { authMiddleware, userMiddleware } from '../middleware/auth';
import * as userController from '../controllers/userController';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);
router.use(userMiddleware);

router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);
router.get('/orders', userController.getUserOrders);
router.get('/orders/:id', userController.getUserOrderById);

// Address management routes
router.get('/addresses', userController.getUserAddresses);
router.post('/addresses', userController.createAddress);
router.put('/addresses/:id', userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);

export default router;
