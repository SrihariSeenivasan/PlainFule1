import { Router } from 'express';
import { authMiddleware, userMiddleware } from '../middleware/auth';
import * as orderController from '../controllers/orderController';

const router = Router();

// All order routes require authentication
router.use(authMiddleware);
router.use(userMiddleware);

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:orderId/payment', orderController.updatePaymentStatus);

export default router;
