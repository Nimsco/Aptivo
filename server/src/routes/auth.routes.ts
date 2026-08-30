import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const generateTokens = (userId: string, email: string) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
  
  const accessToken = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId, email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
};

router.post('/register', async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      throw new AppError('USER_EXISTS', 'An account with this email already exists');
    }
    
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });
    
    const { accessToken, refreshToken } = generateTokens(user.id, user.email);
    
    res.status(201).json({
      success: true,
      data: { user, accessToken, refreshToken }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (!user) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password');
    }
    
    const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
    
    if (!isValidPassword) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password');
    }
    
    const { accessToken, refreshToken } = generateTokens(user.id, user.email);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new AppError('INVALID_TOKEN', 'Refresh token required');
    }
    
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string; email: string };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!user) {
      throw new AppError('USER_NOT_FOUND', 'User not found');
    }
    
    const tokens = generateTokens(user.id, user.email);
    
    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    next(error);
  }
});

export default router;
