import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { AppError } from '../middleware/errorHandler';
import prisma from '../config/database';

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

// GET /api/users/addresses — get all user addresses
export const getUserAddresses = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Not authenticated');
  }

  const addresses = await prisma.address.findMany({
    where: { userId: req.user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });

  res.json(addresses);
};

// POST /api/users/addresses — create new address
export const createAddress = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Not authenticated');
  }

  const { name, email, phone, address, city, state, zipCode, country, isDefault } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !address || !city || !state || !zipCode || !country) {
    throw new AppError(400, 'All address fields are required');
  }

  // If this is being set as default, unset other defaults
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user.id, isDefault: true },
      data: { isDefault: false },
    });
  }

  const newAddress = await prisma.address.create({
    data: {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || false,
      userId: req.user.id,
    },
  });

  res.status(201).json({
    message: 'Address created successfully',
    address: newAddress,
  });
};

// PUT /api/users/addresses/:id — update address
export const updateAddress = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Not authenticated');
  }

  const { id } = req.params;
  const { name, email, phone, address, city, state, zipCode, country, isDefault } = req.body;

  // Verify address belongs to user
  const existingAddress = await prisma.address.findUnique({ where: { id: parseInt(id) } });
  if (!existingAddress) throw new AppError(404, 'Address not found');
  if (existingAddress.userId !== req.user.id) throw new AppError(403, 'You do not have access to this address');

  // If this is being set as default, unset other defaults
  if (isDefault && !existingAddress.isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user.id, isDefault: true },
      data: { isDefault: false },
    });
  }

  const updatedAddress = await prisma.address.update({
    where: { id: parseInt(id) },
    data: {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault !== undefined ? isDefault : existingAddress.isDefault,
    },
  });

  res.json({
    message: 'Address updated successfully',
    address: updatedAddress,
  });
};

// DELETE /api/users/addresses/:id — delete address
export const deleteAddress = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Not authenticated');
  }

  const { id } = req.params;

  // Verify address belongs to user
  const existingAddress = await prisma.address.findUnique({ where: { id: parseInt(id) } });
  if (!existingAddress) throw new AppError(404, 'Address not found');
  if (existingAddress.userId !== req.user.id) throw new AppError(403, 'You do not have access to this address');

  await prisma.address.delete({ where: { id: parseInt(id) } });

  res.json({ message: 'Address deleted successfully' });
};
