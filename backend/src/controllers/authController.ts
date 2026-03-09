import { Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import emailService from '../services/emailService';
import { emailTemplates } from '../services/emailTemplates';
import prisma from '../config/database';

export const register = async (req: AuthRequest, res: Response) => {
  const { email, password, firstName, lastName, phone, role = 'USER' } = req.body;

  if (!email || !password) {
    throw new AppError(400, 'Email and password are required');
  }

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new AppError(400, 'Email already registered');
  }

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    phone,
    role: role === 'ADMIN' ? 'ADMIN' : 'USER'
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    } as SignOptions
  );

  // Remove password from response
  const { password: _password, ...userWithoutPassword } = user;

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: userWithoutPassword
  });
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(400, 'Email and password are required');
  }

  const user = await User.findByEmail(email);
  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }

  const isPasswordValid = await User.verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    } as SignOptions
  );

  // Remove password from response
  const { password: _password, ...userWithoutPassword } = user;

  res.json({
    message: 'Login successful',
    token,
    user: userWithoutPassword
  });
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Not authenticated');
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  // Remove password from response
  const { password: _password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
};

export const googleAuth = async (req: AuthRequest, res: Response) => {
  const { token, email, name, picture } = req.body;

  if (!token || !email) {
    throw new AppError(400, 'Google token and email are required');
  }

  // Try to find existing user
  let user = await User.findByEmail(email);

  if (!user) {
    // Create new user from Google info
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ') || '';
    
    user = await User.create({
      email,
      password: `google_${Math.random().toString(36).slice(2)}`, // Random placeholder, won't be used
      firstName,
      lastName,
      role: 'USER'
    });
  }

  // Generate JWT
  const jwtToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    } as SignOptions
  );

  // Remove password from response
  const { password: _password, ...userWithoutPassword } = user;

  res.json({
    message: 'Google authentication successful',
    token: jwtToken,
    user: userWithoutPassword
  });
};

// POST /api/auth/forgot-password — send password reset email
export const forgotPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    throw new AppError(400, 'Email is required');
  }

  const user = await User.findByEmail(email);
  if (!user) {
    // Don't reveal if email exists for security
    res.json({ message: 'If an account exists with this email, a password reset link has been sent' });
    return;
  }

  try {
    // Generate reset token (valid for 15 minutes)
    const resetToken = jwt.sign(
      { id: user.id, email: user.email, type: 'reset' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '15m' }
    );

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;

    // Send password reset email
    const emailHtml = emailTemplates.passwordReset({
      userName: user.firstName || 'User',
      resetLink,
      expiryTime: '15 minutes',
    });

    await emailService.sendEmail({
      to: user.email,
      subject: 'Password Reset Request - PlainFuel',
      html: emailHtml,
    });

    res.json({ message: 'If an account exists with this email, a password reset link has been sent' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new AppError(500, 'Failed to send password reset email');
  }
};

// POST /api/auth/reset-password — reset password with token
export const resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    throw new AppError(400, 'Token, new password, and confirm password are required');
  }

  if (newPassword !== confirmPassword) {
    throw new AppError(400, 'Passwords do not match');
  }

  if (newPassword.length < 6) {
    throw new AppError(400, 'Password must be at least 6 characters long');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: number; email: string; type: string };

    if (decoded.type !== 'reset') {
      throw new AppError(400, 'Invalid token');
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Hash the new password using the User model
    const hashedPassword = await User.hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(400, 'Password reset link has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(400, 'Invalid password reset link');
    }
    throw error;
  }
};
