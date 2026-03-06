import prisma from '../config/database';
import { Order as PrismaOrder, OrderItem as PrismaOrderItem } from '@prisma/client';

export type Order = PrismaOrder;
export type OrderItem = PrismaOrderItem;

export const Order = {
  async create(orderData: {
    userId: number;
    orderNumber: string;
    totalAmount: number;
    status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    shippingAddress?: string;
  }): Promise<Order> {
    return prisma.order.create({
      data: {
        userId: orderData.userId,
        orderNumber: orderData.orderNumber,
        totalAmount: orderData.totalAmount,
        status: orderData.status || 'PENDING',
        shippingAddress: orderData.shippingAddress,
      },
    });
  },

  async findById(id: number): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { id },
    });
  },

  async findByUserId(userId: number): Promise<Order[]> {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findAll(status?: string): Promise<Order[]> {
    if (status) {
      return prisma.order.findMany({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: { status: status as any },
        orderBy: { createdAt: 'desc' },
      });
    }
    return prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async update(
    id: number,
    orderData: {
      status?: string;
      shippingAddress?: string;
    }
  ): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: orderData.status as any,
        shippingAddress: orderData.shippingAddress,
      },
    });
  },

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.order.delete({
        where: { id },
      });
      return true;
    } catch (_err) {  // eslint-disable-line @typescript-eslint/no-unused-vars
      return false;
    }
  },

  async addItem(
    orderId: number,
    productId: number,
    quantity: number,
    price: number
  ): Promise<OrderItem> {
    return prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
        price,
      },
    });
  },

  async getItems(orderId: number) {
    return prisma.orderItem.findMany({
      where: { orderId },
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    });
  },
};
