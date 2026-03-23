import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Get all reviews for a product
export const getProductReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId) },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

// Get review statistics for a product
export const getReviewStats = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId) },
    });

    if (reviews.length === 0) {
      return res.json({
        success: true,
        data: {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      });
    }

    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return res.json({
      success: true,
      data: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error('Error calculating review stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate review stats' });
  }
};

// Create new review (Authenticated users only)
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { productId, rating, text } = req.body;

    // Validation
    if (!productId || !rating || !text) {
      return res.status(400).json({
        success: false,
        message: 'productId, rating, and text are required',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    if (text.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Review text must be at least 10 characters long',
      });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: userId,
        productId: parseInt(productId),
      },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        text: text.trim(),
        userId,
        productId: parseInt(productId),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ success: false, message: 'Failed to create review' });
  }
};

// Update review (Owner only)
export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { rating, text } = req.body;

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own reviews',
      });
    }

    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id) },
      data: {
        ...(rating !== undefined && { rating }),
        ...(text && { text: text.trim() }),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return res.json({ success: true, data: updatedReview });
  } catch (error) {
    console.error('Error updating review:', error);
    return res.status(500).json({ success: false, message: 'Failed to update review' });
  }
};

// Delete review (Owner or Admin)
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews',
      });
    }

    await prisma.review.delete({
      where: { id: parseInt(id) },
    });

    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
};
