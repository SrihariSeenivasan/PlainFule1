import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Order } from '../models/Order';
import { Product, ProductInput } from '../models/Product';
import { User } from '../models/User';
import { Payment } from '../models/Payment';
import { AppError } from '../middleware/errorHandler';
import prisma from '../config/database';
import emailService from '../services/emailService';
import { emailTemplates } from '../services/emailTemplates';

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

  const orders = await prisma.order.findMany({
    where: status ? { status: status as Order['status'] } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      items: {
        include: {
          product: { select: { name: true } },
          package: { select: { id: true, duration: true, pouches: true } },
        },
      },
      payment: true,
    },
  });

  res.json(orders);
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, shippingAddress } = req.body;

  const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    throw new AppError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  // Get current order before update
  const currentOrder = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { user: true },
  });

  if (!currentOrder) throw new AppError(404, 'Order not found');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { status };
  if (shippingAddress !== undefined) updateData.shippingAddress = shippingAddress;
  if (status === 'DELIVERED') updateData.deliveryDate = new Date();

  const updatedOrder = await prisma.order.update({
    where: { id: parseInt(id) },
    data: updateData,
  });

  // Send status update email to customer
  try {
    const statusMessages: Record<string, string> = {
      PENDING: 'Your order has been received and is awaiting processing.',
      PROCESSING: 'Your order is being processed and will be shipped soon.',
      SHIPPED: 'Your order has been shipped! You can track your package on our website.',
      DELIVERED: 'Your order has been delivered. Thank you for your purchase!',
      CANCELLED: 'Your order has been cancelled.',
    };

    const emailHtml = emailTemplates.orderStatusUpdate({
      userName: currentOrder.user.firstName || 'Customer',
      orderNumber: currentOrder.orderNumber,
      status: status,
      statusMessage: statusMessages[status] || 'Your order status has been updated.',
    });

    await emailService.sendEmail({
      to: currentOrder.user.email,
      subject: `Order Status Update - ${currentOrder.orderNumber}: ${status}`,
      html: emailHtml,
    });
  } catch (emailError) {
    console.error('Error sending status update email:', emailError);
  }

  res.json({ message: 'Order updated successfully', order: updatedOrder });
};

// GET /api/admin/returns — all return requests
export const getAllReturnRequests = async (req: AuthRequest, res: Response) => {
  const { status } = req.query;

  const returnRequests = await prisma.returnRequest.findMany({
    where: status ? { status: status as 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'RECEIVED' | 'REFUNDED' } : undefined,
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      order: { select: { id: true, orderNumber: true, totalAmount: true } },
      items: {
        include: {
          orderItem: {
            include: {
              product: { select: { name: true } },
              package: { select: { id: true, duration: true, pouches: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(returnRequests);
};

// PUT /api/admin/returns/:id — approve/reject a return request
export const updateReturnStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['APPROVED', 'REJECTED', 'RECEIVED', 'REFUNDED'];
  if (!validStatuses.includes(status)) {
    throw new AppError(400, `Invalid return status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const returnRequest = await prisma.returnRequest.findUnique({
    where: { id: parseInt(id) },
    include: {
      items: {
        include: { orderItem: true },
      },
    },
  });

  if (!returnRequest) throw new AppError(404, 'Return request not found');

  if (status === 'APPROVED') {
    await prisma.$transaction(async (tx) => {
      // Restore stock for returned items
      for (const ri of returnRequest.items) {
        if (ri.orderItem.packageId) {
          await tx.package.update({
            where: { id: ri.orderItem.packageId },
            data: { stock: { increment: ri.quantity } },
          });
        }
      }
      await tx.returnRequest.update({
        where: { id: returnRequest.id },
        data: { status: 'APPROVED' },
      });
    });
  } else {
    await prisma.returnRequest.update({
      where: { id: returnRequest.id },
      data: { status: status as 'REJECTED' | 'RECEIVED' | 'REFUNDED' },
    });
  }

  res.json({ message: `Return request ${status.toLowerCase()} successfully` });
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
  const { name, description, category, packages } = req.body;

  if (!name || !category) {
    throw new AppError(400, 'Name and category are required');
  }

  if (!packages || !Array.isArray(packages) || packages.length === 0) {
    throw new AppError(400, 'At least one package is required');
  }

  const product = await Product.create({
    name,
    description,
    category,
    packages,
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
  const { name, description, category, packages } = req.body;

  const product = await Product.findById(parseInt(id));
  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  if (packages && (!Array.isArray(packages) || packages.length === 0)) {
    throw new AppError(400, 'At least one package is required');
  }

  const updateData: Partial<ProductInput> = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (category !== undefined) updateData.category = category;
  if (packages !== undefined) updateData.packages = packages;

  const updatedProduct = await Product.update(parseInt(id), updateData);

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
