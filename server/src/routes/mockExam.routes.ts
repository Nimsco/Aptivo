import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { examId, name, questionCount = 50, timeLimit, difficulty = 'mixed' } = req.body;
    
    const mockExam = await prisma.mockExam.create({
      data: { userId: req.user!.id, examId, name, questionCount, timeLimit, difficulty }
    });
    
    res.status(201).json({ success: true, data: mockExam });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const exams = await prisma.mockExam.findMany({
      where: { userId: req.user!.id },
      include: { attempts: true }
    });
    res.json({ success: true, data: exams });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/start', async (req: AuthRequest, res, next) => {
  try {
    const attempt = await prisma.mockExamAttempt.create({
      data: { userId: req.user!.id, mockExamId: req.params.id }
    });
    res.json({ success: true, data: attempt });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/submit', async (req: AuthRequest, res, next) => {
  try {
    const { score, totalQuestions, timeSpent } = req.body;
    
    const attempt = await prisma.mockExamAttempt.update({
      where: { id: req.params.id },
      data: { score, totalQuestions, timeSpent, completedAt: new Date() }
    });
    
    res.json({ success: true, data: attempt });
  } catch (error) {
    next(error);
  }
});

export default router;
