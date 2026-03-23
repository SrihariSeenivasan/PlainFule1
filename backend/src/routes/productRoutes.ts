import { Router } from 'express';
import * as productController from '../controllers/productController';

const router = Router();

// Public routes - anyone can view products
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:category', productController.getProductsByCategory);

export default router;
