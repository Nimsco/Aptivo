import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  timezone: z.string().optional(),
  studyField: z.string().optional()
});

router.get('/profile', async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, timezone: true, studyField: true, avatarUrl: true, createdAt: true }
    });
    
    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found');
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

router.patch('/profile', async (req: AuthRequest, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: validatedData,
      select: { id: true, email: true, name: true, timezone: true, studyField: true }
    });
    
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

router.post('/change-password', async (req: AuthRequest, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      throw new AppError('INVALID_REQUEST', 'Current and new password required');
    }
    
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found');
    }
    
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new AppError('INVALID_PASSWORD', 'Current password is incorrect');
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: hashedPassword }
    });
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
