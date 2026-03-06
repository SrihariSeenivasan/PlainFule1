import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export const errorHandler = (err: Error & { code?: string }, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.code === '23505') {
    // Unique constraint violation
    return res.status(400).json({ error: 'Email already exists' });
  }

  if (err.code === '23503') {
    // Foreign key constraint violation
    return res.status(400).json({ error: 'Invalid reference' });
  }

  return res.status(500).json({ error: 'Internal server error' });
};
