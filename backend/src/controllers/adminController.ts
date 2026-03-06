import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Payment } from '../models/Payment';
import { AppError } from '../middleware/errorHandler';

export const getAllUsers = async (_req: AuthRequest, res: Response) => {
  const users = await User.findAll();
  
  // Remove passwords from response
  const usersWithoutPasswords = users.map(u => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = u;
    return user;
  });

  res.json(usersWithoutPasswords);
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  const { status } = req.query;
  const orders = await Order.findAll(status as string);

  // Get items for each order
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => ({
      ...order,
      items: await Order.getItems(order.id)
    }))
  );

  res.json(ordersWithItems);
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, shippingAddress } = req.body;

  const updatedOrder = await Order.update(parseInt(id), {
    status,
    shippingAddress
  });

  res.json({
    message: 'Order updated successfully',
    order: updatedOrder
  });
};

export const getAdminDashboard = async (_req: AuthRequest, res: Response) => {
  const revenueStats = await Payment.getRevenueStats();
  const allOrders = await Order.findAll();
  const allUsers = await User.findAll();
  const allProducts = await Product.findAll();

  res.json({
    stats: revenueStats,
    totalUsers: allUsers.length,
    totalProducts: allProducts.length,
    totalOrders: allOrders.length,
    recentOrders: allOrders.slice(0, 10)
  });
};

// Product Management
export const createProduct = async (req: AuthRequest, res: Response) => {
  const {
    name, description, price, category, stock,
    subscribePrice, origPrice, tag, duration, subtitle, rating, reviews,
    headline, accentWord, grayWord, persuade, tagline, highlight, savePct,
    benefits, badges, variants, nutrients, images,
  } = req.body;

  if (!name || !price) {
    throw new AppError(400, 'Name and price are required');
  }

  const product = await Product.create({
    name, description, price, category, stock: stock ?? 0,
    subscribePrice, origPrice, tag, duration, subtitle, rating, reviews,
    headline, accentWord, grayWord, persuade, tagline, highlight, savePct,
    benefits, badges, variants, nutrients, images,
  });

  res.status(201).json({
    message: 'Product created successfully',
    product
  });
};

export const getAllProducts = async (_req: AuthRequest, res: Response) => {
  const products = await Product.findAll();
  res.json(products);
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    name, description, price, category, stock,
    subscribePrice, origPrice, tag, duration, subtitle, rating, reviews,
    headline, accentWord, grayWord, persuade, tagline, highlight, savePct,
    benefits, badges, variants, nutrients, images,
  } = req.body;

  const product = await Product.findById(parseInt(id));
  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  const updatedProduct = await Product.update(parseInt(id), {
    name, description, price, category, stock,
    subscribePrice, origPrice, tag, duration, subtitle, rating, reviews,
    headline, accentWord, grayWord, persuade, tagline, highlight, savePct,
    benefits, badges, variants, nutrients, images,
  });

  res.json({
    message: 'Product updated successfully',
    product: updatedProduct
  });
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const product = await Product.findById(parseInt(id));
  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  await Product.delete(parseInt(id));

  res.json({ message: 'Product deleted successfully' });
};
