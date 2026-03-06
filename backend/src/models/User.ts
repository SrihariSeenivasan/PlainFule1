import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import { User as PrismaUser } from '@prisma/client';

export type User = PrismaUser;

export const User = {
  async create(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: 'USER' | 'ADMIN';
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: userData.role || 'USER',
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zip: userData.zip,
        country: userData.country,
      },
    });
  },

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async findAll(role?: string): Promise<User[]> {
    if (role) {
      return prisma.user.findMany({
        where: { role: role as 'USER' | 'ADMIN' },
      });
    }
    return prisma.user.findMany();
  },

  async update(
    id: number,
    userData: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: userData,
    });
  },

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (_err) {  // eslint-disable-line @typescript-eslint/no-unused-vars
      return false;
    }
  },

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  },
};

