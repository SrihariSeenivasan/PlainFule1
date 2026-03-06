import prisma from '../config/database';
import { Product as PrismaProduct } from '@prisma/client';

export type Product = PrismaProduct;

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock?: number;
  // Pricing
  subscribePrice?: number;
  origPrice?: number;
  // Display info
  tag?: string;
  duration?: string;
  subtitle?: string;
  rating?: number;
  reviews?: number;
  // Marketing copy
  headline?: string;
  accentWord?: string;
  grayWord?: string;
  persuade?: string;
  tagline?: string;
  highlight?: string;
  savePct?: string;
  // JSON arrays
  benefits?: string[];
  badges?: string[];
  variants?: { id: string; name: string; color: string; image: string }[];
  nutrients?: { label: string; friendly?: string; emoji?: string; amount?: string }[];
  images?: string[];
}

export const Product = {
  async create(productData: ProductInput): Promise<Product> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return prisma.product.create({ data: productData as any });
  },

  async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  },

  async findAll(): Promise<Product[]> {
    return prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async findByCategory(category: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' },
    });
  },

  async update(
    id: number,
    productData: Partial<ProductInput>
  ): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: productData,
    });
  },

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.product.delete({
        where: { id },
      });
      return true;
    } catch (_err) {  // eslint-disable-line @typescript-eslint/no-unused-vars
      return false;
    }
  },
};
