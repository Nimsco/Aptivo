import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { examId } = req.query;
    const topics = await prisma.topic.findMany({
      where: examId ? { examId: examId as string } : {},
      include: { children: true, performance: true }
    });
    res.json({ success: true, data: topics });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { confidence, importance, difficulty } = req.body;
    
    const topic = await prisma.topic.update({
      where: { id },
      data: { confidence, importance, difficulty }
    });
    
    res.json({ success: true, data: topic });
  } catch (error) {
    next(error);
  }
});

export default router;
