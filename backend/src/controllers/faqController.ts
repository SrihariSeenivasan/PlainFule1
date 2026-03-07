import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Get all FAQs with optional filtering
export const getFAQs = async (req: AuthRequest, res: Response) => {
  try {
    const { type, productId } = req.query;

    const faqs = await prisma.fAQ.findMany({
      where: {
        ...(type && { type: type as 'PRODUCT' | 'COMMON' }),
        ...(productId && { productId: parseInt(productId as string) }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, data: faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch FAQs' });
  }
};

// Get single FAQ by ID
export const getFAQById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const faq = await prisma.fAQ.findUnique({
      where: { id: parseInt(id) },
    });

    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    return res.json({ success: true, data: faq });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch FAQ' });
  }
};

// Create new FAQ (Admin only)
export const createFAQ = async (req: AuthRequest, res: Response) => {
  try {
    const { question, answer, type, productId } = req.body;

    // Validation
    if (!question?.trim() || !answer?.trim()) {
      return res.status(400).json({ success: false, message: 'Question and answer are required' });
    }

    const faq = await prisma.fAQ.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        type: type || 'PRODUCT',
        ...(productId && { productId: parseInt(productId) }),
      },
    });

    return res.status(201).json({ success: true, data: faq });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return res.status(500).json({ success: false, message: 'Failed to create FAQ' });
  }
};

// Update FAQ (Admin only)
export const updateFAQ = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer, type, productId } = req.body;

    // Check if FAQ exists
    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingFAQ) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    const faq = await prisma.fAQ.update({
      where: { id: parseInt(id) },
      data: {
        ...(question && { question: question.trim() }),
        ...(answer && { answer: answer.trim() }),
        ...(type && { type }),
        ...(productId !== undefined && { productId: productId ? parseInt(productId) : null }),
      },
    });

    return res.json({ success: true, data: faq });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return res.status(500).json({ success: false, message: 'Failed to update FAQ' });
  }
};

// Delete FAQ (Admin only)
export const deleteFAQ = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if FAQ exists
    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingFAQ) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    await prisma.fAQ.delete({
      where: { id: parseInt(id) },
    });

    return res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete FAQ' });
  }
};
