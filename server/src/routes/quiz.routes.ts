import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { examId, topicId, name, questionCount = 10, difficulty = 'mixed' } = req.body;
    
    const quiz = await prisma.quiz.create({
      data: { userId: req.user!.id, examId, topicId, name, questionCount, difficulty }
    });
    
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { userId: req.user!.id },
      include: { questions: true, attempts: true }
    });
    res.json({ success: true, data: quizzes });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/start', async (req: AuthRequest, res, next) => {
  try {
    const attempt = await prisma.quizAttempt.create({
      data: { userId: req.user!.id, quizId: req.params.id }
    });
    res.json({ success: true, data: attempt });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/submit', async (req: AuthRequest, res, next) => {
  try {
    const { answers } = req.body; // Array of { questionId, answer, isCorrect }
    
    const score = answers.filter((a: any) => a.isCorrect).length;
    
    const attempt = await prisma.quizAttempt.update({
      where: { id: req.params.id },
      data: {
        score,
        totalQuestions: answers.length,
        timeSpent: req.body.timeSpent || 0,
        completedAt: new Date(),
        answers: { create: answers }
      }
    });
    
    res.json({ success: true, data: attempt });
  } catch (error) {
    next(error);
  }
});

export default router;
