import prisma from '../config/database';
import { Payment as PrismaPayment } from '@prisma/client';

export type Payment = PrismaPayment;

export const Payment = {
  async create(paymentData: {
    orderId: number;
    amount: number;
    paymentMethod?: string;
    status?: 'PENDING' | 'COMPLETED' | 'FAILED';
    transactionId?: string;
  }): Promise<Payment> {
    return prisma.payment.create({
      data: {
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        status: paymentData.status || 'PENDING',
        transactionId: paymentData.transactionId,
      },
    });
  },

  async findByOrderId(orderId: number): Promise<Payment | null> {
    return prisma.payment.findUnique({
      where: { orderId },
    });
  },

  async update(
    id: number,
    paymentData: {
      status?: string;
      transactionId?: string;
    }
  ): Promise<Payment> {
    return prisma.payment.update({
      where: { id },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: paymentData.status as any,
        transactionId: paymentData.transactionId,
      },
    });
  },

  async getRevenueStats(): Promise<{
    total_revenue: number | null;
    total_orders: number;
    pending_orders: number;
  }> {
    const payments = await prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    });

    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' },
    });

    return {
      total_revenue: payments._sum.amount ? parseFloat(payments._sum.amount.toString()) : 0,
      total_orders: totalOrders,
      pending_orders: pendingOrders,
    };
  },
};
