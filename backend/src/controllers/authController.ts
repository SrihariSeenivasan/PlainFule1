import { Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';

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
