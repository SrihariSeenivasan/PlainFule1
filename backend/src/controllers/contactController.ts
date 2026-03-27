import { Request, Response } from 'express';
import prisma from '../config/database';

export const createMessage = async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }

  const contactMessage = await prisma.contactMessage.create({
    data: { name, email, phone, subject, message },
  });

  return res.status(201).json(contactMessage);
};

export const getMessages = async (_req: Request, res: Response) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return res.json(messages);
};

export const getMessageById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await prisma.contactMessage.findUnique({
    where: { id: parseInt(id) },
  });

  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }

  return res.json(message);
};

export const updateMessageStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const message = await prisma.contactMessage.update({
    where: { id: parseInt(id) },
    data: { status },
  });

  res.json(message);
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.contactMessage.delete({
    where: { id: parseInt(id) },
  });

  res.json({ message: 'Message deleted successfully' });
};
