import prisma from '../config/database';
import { Product as PrismaProduct, Package as PrismaPackage } from '@prisma/client';

export type Product = PrismaProduct & { packages?: PrismaPackage[] };
export type Package = PrismaPackage;

export interface PackageInput {
  id: string;
  duration: string;
  daysCount: number;
  pouches: number;
  price: number;
  origPrice?: number;
  savePct?: string;
  stock?: number;
  tag?: string;
  subtitle?: string;
  headline?: string;
  accentWord?: string;
  grayWord?: string;
  persuade?: string;
  tagline?: string;
  highlight?: string;
  images?: string[];
  benefits?: string[];
  badges?: string[];
  variants?: Record<string, unknown>[];
  nutrients?: Record<string, unknown>[];
}

export interface ProductInput {
  name: string;
  description?: string;
  category?: string;
  packages?: PackageInput[];
}

export const Product = {
  async create(productData: ProductInput): Promise<Product> {
    const { packages, ...productFields } = productData;
    
    // Validate and normalize package data
    const normalizedPackages = (packages || []).map(pkg => ({
      ...pkg,
      price: Number(pkg.price) || 0,
      origPrice: pkg.origPrice ? Number(pkg.origPrice) : null,
      daysCount: Number(pkg.daysCount) || 0,
      pouches: Number(pkg.pouches) || 0,
      stock: pkg.stock ? Number(pkg.stock) : 0,
      images: Array.isArray(pkg.images) ? pkg.images : [],
      benefits: Array.isArray(pkg.benefits) ? pkg.benefits : [],
      badges: Array.isArray(pkg.badges) ? pkg.badges : [],
      variants: Array.isArray(pkg.variants) ? pkg.variants : [],
      nutrients: Array.isArray(pkg.nutrients) ? pkg.nutrients : [],
    }));
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return prisma.product.create({
      data: {
        ...productFields,
        packages: {
          create: normalizedPackages as any,
        },
      } as any,
      include: { packages: true },
    });
  },

  async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: { packages: true },
    });
  },

  async findAll(): Promise<Product[]> {
    return prisma.product.findMany({
      include: { packages: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findByCategory(category: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { category },
      include: { packages: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async update(
    id: number,
    productData: Partial<ProductInput>
  ): Promise<Product> {
    const { packages, ...productFields } = productData;
    
    // Delete existing packages if new ones are provided
    if (packages) {
      await prisma.package.deleteMany({
        where: { productId: id },
      });

      // Validate and normalize package data
      const normalizedPackages = packages.map(pkg => ({
        ...pkg,
        price: Number(pkg.price) || 0,
        origPrice: pkg.origPrice ? Number(pkg.origPrice) : null,
        daysCount: Number(pkg.daysCount) || 0,
        pouches: Number(pkg.pouches) || 0,
        stock: pkg.stock ? Number(pkg.stock) : 0,
        images: Array.isArray(pkg.images) ? pkg.images : [],
        benefits: Array.isArray(pkg.benefits) ? pkg.benefits : [],
        badges: Array.isArray(pkg.badges) ? pkg.badges : [],
        variants: Array.isArray(pkg.variants) ? pkg.variants : [],
        nutrients: Array.isArray(pkg.nutrients) ? pkg.nutrients : [],
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return prisma.product.update({
        where: { id },
        data: {
          ...productFields,
          packages: {
            create: normalizedPackages as any,
          },
        } as any,
        include: { packages: true },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return prisma.product.update({
      where: { id },
      data: productFields as any,
      include: { packages: true },
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
