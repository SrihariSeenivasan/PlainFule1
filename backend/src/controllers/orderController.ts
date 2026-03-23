import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import prisma from '../config/database';
import emailService from '../services/emailService';
import { emailTemplates } from '../services/emailTemplates';

const generateOrderNumber = (): string => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// POST /api/orders — place order with simulated payment
export const createOrder = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError(401, 'Not authenticated');

  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) throw new AppError(400, 'Order must contain at least one item');
  if (!shippingAddress) throw new AppError(400, 'Shipping address is required');

  for (const item of items) {
    if (!item.packageId) throw new AppError(400, 'packageId is required for each item');
    if (!item.productId) throw new AppError(400, 'productId is required for each item');
    if (!item.quantity || item.quantity < 1) throw new AppError(400, 'quantity must be at least 1');
  }

  const orderNumber = generateOrderNumber();

  const result = await prisma.$transaction(async (tx) => {
    let totalAmount = 0;

    // Validate stock and compute total from DB prices (prevent price manipulation)
    for (const item of items) {
      const pkg = await tx.package.findUnique({ where: { id: item.packageId } });
      if (!pkg) throw new AppError(404, `Package "${item.packageId}" not found`);
      if (pkg.stock < item.quantity) {
        throw new AppError(400, `Insufficient stock for package "${item.packageId}" (available: ${pkg.stock})`);
      }
      totalAmount += parseFloat(pkg.price.toString()) * item.quantity;
    }

    // Create order
    const order = await tx.order.create({
      data: {
        userId: req.user!.id,
        orderNumber,
        totalAmount,
        status: 'PENDING',
        shippingAddress,
      },
    });

    // Create order items & deduct stock
    for (const item of items) {
      const pkg = await tx.package.findUnique({ where: { id: item.packageId } });
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          packageId: item.packageId,
          quantity: item.quantity,
          price: pkg!.price,
        },
      });
      await tx.package.update({
        where: { id: item.packageId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Simulate successful payment
    const payment = await tx.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        paymentMethod: 'SIMULATED',
        status: 'COMPLETED',
        transactionId: `SIM-${Date.now()}`,
      },
    });

    // Clear user's cart after successful order
    const cart = await tx.cart.findUnique({ where: { userId: req.user!.id } });
    if (cart) {
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return { order, payment };
  });

  // Fetch complete order details with items for email
  const completeOrder = await prisma.order.findUnique({
    where: { id: result.order.id },
    include: {
      user: true,
      items: {
        include: {
          product: { select: { name: true } },
          package: { select: { price: true } },
        },
      },
    },
  });

  // Send order confirmation email to customer
  if (completeOrder) {
    try {
      const orderItems = completeOrder.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.package ? parseFloat(item.package.price.toString()) : 0,
      }));

      const emailHtml = emailTemplates.orderConfirmation({
        userName: completeOrder.user.firstName || 'Customer',
        orderNumber: completeOrder.orderNumber,
        items: orderItems,
        totalAmount: parseFloat(completeOrder.totalAmount.toString()),
        shippingAddress: completeOrder.shippingAddress || 'Not provided',
        orderDate: new Date().toLocaleDateString(),
      });

      await emailService.sendEmail({
        to: completeOrder.user.email,
        subject: `Order Confirmation - ${completeOrder.orderNumber}`,
        html: emailHtml,
      });

      // Send admin notification
      if (process.env.ADMIN_EMAIL) {
        const adminEmailHtml = emailTemplates.adminNewOrder({
          orderNumber: completeOrder.orderNumber,
          customerName: `${completeOrder.user.firstName} ${completeOrder.user.lastName}`,
          customerEmail: completeOrder.user.email,
          items: orderItems,
          totalAmount: parseFloat(completeOrder.totalAmount.toString()),
          status: completeOrder.status,
        });

        await emailService.sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `🔔 New Order Received - ${completeOrder.orderNumber}`,
          html: adminEmailHtml,
        });
      }
    } catch (emailError) {
      console.error('Error sending order emails:', emailError);
      // Continue even if email fails
    }
  }

  res.status(201).json({
    message: 'Order placed successfully',
    order: result.order,
    payment: result.payment,
  });
};

// GET /api/orders — get current user's orders
export const getOrders = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError(401, 'Not authenticated');

  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
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

// GET /api/orders/:id — get single order
export const getOrderById = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError(401, 'Not authenticated');

  const { id } = req.params;
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: {
      items: {
        include: {
          product: { select: { name: true } },
          package: { select: { id: true, duration: true, pouches: true } },
        },
      },
      payment: true,
    },
  });

  if (!order) throw new AppError(404, 'Order not found');
  if (order.userId !== req.user.id) throw new AppError(403, 'You do not have access to this order');

  res.json(order);
};

// POST /api/orders/:id/cancel — cancel an order
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError(401, 'Not authenticated');

  const { id } = req.params;
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { items: true, user: true },
  });

  if (!order) throw new AppError(404, 'Order not found');
  if (order.userId !== req.user.id) throw new AppError(403, 'You do not have access to this order');

  if (!['PENDING', 'PROCESSING'].includes(order.status)) {
    throw new AppError(400, 'Order can only be cancelled when status is PENDING or PROCESSING');
  }

  await prisma.$transaction(async (tx) => {
    // Restore package stock
    for (const item of order.items) {
      if (item.packageId) {
        await tx.package.update({
          where: { id: item.packageId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    await tx.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' },
    });

    // Simulated refund
    await tx.payment.updateMany({
      where: { orderId: order.id },
      data: { status: 'REFUNDED', transactionId: `REFUND-SIM-${Date.now()}` },
    });
  });

  // Send cancellation email
  try {
    const emailHtml = emailTemplates.orderStatusUpdate({
      userName: order.user.firstName || 'Customer',
      orderNumber: order.orderNumber,
      status: 'CANCELLED',
      statusMessage: 'Your order has been cancelled and a full refund has been processed. The refund may take 5-7 business days to appear in your account.',
    });

    await emailService.sendEmail({
      to: order.user.email,
      subject: `Order Cancelled - ${order.orderNumber}`,
      html: emailHtml,
    });
  } catch (emailError) {
    console.error('Error sending cancellation email:', emailError);
  }

  res.json({ message: 'Order cancelled successfully. Refund has been simulated.' });
};

// POST /api/orders/:id/return — initiate a return request
export const createReturnRequest = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError(401, 'Not authenticated');

  const { id } = req.params;
  const { reason, items } = req.body; // items: [{orderItemId, quantity}]

  if (!items || items.length === 0) throw new AppError(400, 'At least one item is required for a return');

  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { items: true },
  });

  if (!order) throw new AppError(404, 'Order not found');
  if (order.userId !== req.user.id) throw new AppError(403, 'You do not have access to this order');
  if (order.status !== 'DELIVERED') throw new AppError(400, 'Only delivered orders can be returned');

  // Enforce 7-day return window
  if (!order.deliveryDate) throw new AppError(400, 'Delivery date not recorded for this order');
  const returnDeadline = new Date(order.deliveryDate);
  returnDeadline.setDate(returnDeadline.getDate() + 7);
  if (new Date() > returnDeadline) {
    throw new AppError(400, 'Return window has expired. Returns must be requested within 7 days of delivery.');
  }

  // Check for duplicate active return request
  const existing = await prisma.returnRequest.findFirst({
    where: {
      orderId: order.id,
      status: { in: ['REQUESTED', 'APPROVED', 'RECEIVED'] },
    },
  });
  if (existing) throw new AppError(400, 'A return request for this order is already in progress');

  // Validate return items and compute refund
  let refundAmount = 0;
  for (const ri of items) {
    if (!ri.orderItemId || !ri.quantity || ri.quantity < 1) {
      throw new AppError(400, 'Each return item must have orderItemId and a positive quantity');
    }
    const orderItem = order.items.find((i) => i.id === ri.orderItemId);
    if (!orderItem) throw new AppError(400, `OrderItem ${ri.orderItemId} does not belong to this order`);
    if (ri.quantity > orderItem.quantity) {
      throw new AppError(400, `Return quantity (${ri.quantity}) exceeds purchased quantity (${orderItem.quantity})`);
    }
    refundAmount += parseFloat(orderItem.price.toString()) * ri.quantity;
  }

  const returnRequest = await prisma.returnRequest.create({
    data: {
      orderId: order.id,
      userId: req.user.id,
      status: 'REQUESTED',
      reason: reason || null,
      refundAmount,
      items: {
        create: items.map((ri: { orderItemId: number; quantity: number }) => ({
          orderItemId: ri.orderItemId,
          quantity: ri.quantity,
        })),
      },
    },
    include: {
      items: {
        include: {
          orderItem: {
            include: {
              product: { select: { name: true } },
              package: { select: { id: true, duration: true } },
            },
          },
        },
      },
    },
  });

  // Send return request notification to admin
  try {
    if (process.env.ADMIN_EMAIL && returnRequest.items[0]) {
      // Fetch full user details for email
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { firstName: true, lastName: true },
      });

      const adminEmailHtml = emailTemplates.adminReturnRequest({
        returnId: `RET-${returnRequest.id}`,
        orderNumber: order.orderNumber,
        customerName: `${user?.firstName} ${user?.lastName}`,
        productName: returnRequest.items[0].orderItem.product.name,
        reason: reason || 'No reason provided',
      });

      await emailService.sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `📦 New Return Request - ${order.orderNumber}`,
        html: adminEmailHtml,
      });
    }
  } catch (emailError) {
    console.error('Error sending return request email:', emailError);
  }

  res.status(201).json({ message: 'Return request submitted successfully', returnRequest });
};

// GET /api/orders/returns — get current user's return requests
export const getUserReturnRequests = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError(401, 'Not authenticated');

  const returnRequests = await prisma.returnRequest.findMany({
    where: { userId: req.user.id },
    include: {
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

// Legacy handler kept for backward compatibility
export const updatePaymentStatus = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError(401, 'Not authenticated');

  const { orderId } = req.params;
  const { status, transactionId } = req.body;

  const payment = await prisma.payment.findUnique({ where: { orderId: parseInt(orderId) } });
  if (!payment) throw new AppError(404, 'Payment not found');

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { status: status as any, transactionId },
  });

  res.json({ message: 'Payment updated successfully', payment: updatedPayment });
};
