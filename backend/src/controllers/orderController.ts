import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Order } from '../models/Order';
import { Payment } from '../models/Payment';
import { AppError } from '../middleware/errorHandler';

const generateOrderNumber = (): string => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Not authenticated');
  }

  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    throw new AppError(400, 'Order must contain at least one item');
  }

  if (!shippingAddress) {
    throw new AppError(400, 'Shipping address is required');
  }

  // Calculate total amount
  interface OrderItem {
    price: number;
    quantity: number;
    productId: number;
  }
  let totalAmount = 0;
  items.forEach((item: OrderItem) => {
    totalAmount += item.price * item.quantity;
  });

  // Create order
  const orderNumber = generateOrderNumber();
  const order = await Order.create({
    userId: req.user.id,
    orderNumber: orderNumber,
    totalAmount: totalAmount,
    status: 'PENDING',
    shippingAddress
  });

  // Add order items
  for (const item of items) {
    await Order.addItem(order.id, item.productId, item.quantity, item.price);
  }

  // Create payment record
  await Payment.create({
    orderId: order.id,
    amount: totalAmount,
    paymentMethod: 'pending',
    status: 'PENDING'
  });

  res.status(201).json({
    message: 'Order created successfully',
    order: {
      ...order,
      items: items
    }
  });
};

export const getOrders = async (req: AuthRequest, res: Response) => {
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

export const getOrderById = async (req: AuthRequest, res: Response) => {
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
  const payment = await Payment.findByOrderId(order.id);

  res.json({
    ...order,
    items,
    payment
  });
};

export const updatePaymentStatus = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Not authenticated');
  }

  const { orderId } = req.params;
  const { status, transactionId } = req.body;

  const payment = await Payment.findByOrderId(parseInt(orderId));
  if (!payment) {
    throw new AppError(404, 'Payment not found');
  }

  const updatedPayment = await Payment.update(payment.id, {
    status,
    transactionId
  });

  res.json({
    message: 'Payment updated successfully',
    payment: updatedPayment
  });
};
