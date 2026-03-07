import { Response } from 'express';
import { Request } from 'express';
import { Product } from '../models/Product';
import { AppError } from '../middleware/errorHandler';

// Get all products (public)
export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await Product.findAll();
  res.json(products);
};

// Get product by ID (public)
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findById(parseInt(id));
  
  if (!product) {
    throw new AppError(404, 'Product not found');
  }
  
  res.json(product);
};

// Get products by category (public)
export const getProductsByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;
  const products = await Product.findByCategory(category);
  res.json(products);
};
