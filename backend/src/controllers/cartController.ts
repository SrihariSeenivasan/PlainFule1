import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to get or create cart for user
async function getOrCreateCart(userId: number) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: true },
    });
  }

  return cart;
}

// Get user's cart
export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const cart = await getOrCreateCart(req.user.id);

    res.json({
      id: cart.id,
      userId: cart.userId,
      items: cart.items,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Add item to cart
export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { productId, packageId, quantity, price } = req.body;

    if (!productId || !packageId || !quantity || price === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const cart = await getOrCreateCart(req.user.id);

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_packageId: {
          cartId: cart.id,
          productId: parseInt(productId),
          packageId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parseInt(quantity) },
      });

      res.status(200).json({
        message: 'Item quantity updated',
        item: updated,
      });
      return;
    }

    // Create new cart item
    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: parseInt(productId),
        packageId,
        quantity: parseInt(quantity),
        price: parseFloat(price),
      },
    });

    res.status(201).json({
      message: 'Item added to cart',
      item: newItem,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      res.status(400).json({ error: 'Invalid quantity' });
      return;
    }

    // Verify item belongs to user's cart
    const item = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId) },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== req.user.id) {
      res.status(403).json({ error: 'Item not found in your cart' });
      return;
    }

    if (quantity === 0) {
      // Delete item if quantity is 0
      await prisma.cartItem.delete({
        where: { id: parseInt(itemId) },
      });

      res.json({ message: 'Item removed from cart' });
      return;
    }

    const updated = await prisma.cartItem.update({
      where: { id: parseInt(itemId) },
      data: { quantity: parseInt(quantity) },
    });

    res.json({
      message: 'Cart item updated',
      item: updated,
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// Remove item from cart
export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { itemId } = req.params;

    // Verify item belongs to user's cart
    const item = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId) },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== req.user.id) {
      res.status(403).json({ error: 'Item not found in your cart' });
      return;
    }

    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) },
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Clear entire cart
export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const cart = await getOrCreateCart(req.user.id);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
