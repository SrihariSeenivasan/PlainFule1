import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { AppError } from '../middleware/errorHandler';

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Not authenticated');
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const { password: _password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Not authenticated');
  }

  const { firstName, lastName, phone, address, city, state, zip, country } = req.body;

  const updatedUser = await User.update(req.user.id, {
    firstName,
    lastName,
    phone,
    address,
    city,
    state,
    zip,
    country
  });

  const { password: _password, ...userWithoutPassword } = updatedUser;
  res.json({
    message: 'Profile updated successfully',
    user: userWithoutPassword
  });
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Not authenticated');
  }

  const orders = await Order.findByUserId(req.user.id);

  // Get items for each order
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => ({
      ...order,
      items: await Order.getItems(order.id)
    }))
  );

  res.json(ordersWithItems);
};

export const getUserOrderById = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Not authenticated');
  }

  const { id } = req.params;
  const order = await Order.findById(parseInt(id));

  if (!order) {
    throw new AppError(404, 'Order not found');
  }

  // Verify the order belongs to the user
  if (order.userId !== req.user.id) {
    throw new AppError(403, 'You do not have access to this order');
  }

  const items = await Order.getItems(order.id);

  res.json({
    ...order,
    items
  });
};
