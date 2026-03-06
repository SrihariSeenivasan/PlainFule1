import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import * as adminController from '../controllers/adminController';

const router = Router();

// All admin routes require admin authentication
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard
router.get('/dashboard', adminController.getAdminDashboard);

// Users management
router.get('/users', adminController.getAllUsers);

// Orders management
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id', adminController.updateOrderStatus);

// Products management
router.get('/products', adminController.getAllProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

export default router;
