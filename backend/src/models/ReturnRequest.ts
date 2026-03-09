import prisma from '../config/database';
import { ReturnRequest as PrismaReturnRequest, ReturnItem as PrismaReturnItem } from '@prisma/client';

export type ReturnRequest = PrismaReturnRequest;
export type ReturnItem = PrismaReturnItem;

export const ReturnRequest = {
  async findAll(status?: string) {
    return prisma.returnRequest.findMany({
      where: status ? { status: status as ReturnRequest['status'] } : undefined,
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
  },

  async findByUserId(userId: number) {
    return prisma.returnRequest.findMany({
      where: { userId },
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
  },

  async findById(id: number) {
    return prisma.returnRequest.findUnique({
      where: { id },
      include: {
        order: { select: { id: true, orderNumber: true, totalAmount: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
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
    });
  },
};
