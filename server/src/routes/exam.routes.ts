import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

const createExamSchema = z.object({
  name: z.string().min(1, 'Exam name is required'),
  module: z.string().optional(),
  examDate: z.string().transform(s => new Date(s)),
  targetGrade: z.enum(['Pass', 'Good', 'Excellent', 'Top grade']).optional(),
  studyHoursPerDay: z.number().min(1).max(24).default(2),
  description: z.string().optional()
});

const updateExamSchema = z.object({
  name: z.string().min(1).optional(),
  module: z.string().optional(),
  examDate: z.string().transform(s => new Date(s)).optional(),
  targetGrade: z.enum(['Pass', 'Good', 'Excellent', 'Top grade']).optional(),
  studyHoursPerDay: z.number().min(1).max(24).optional(),
  description: z.string().optional(),
  readiness: z.number().min(0).max(100).optional()
});

// GET all exams for user
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const exams = await prisma.exam.findMany({
      where: { userId: req.user!.id },
      include: {
        subjects: true,
        topics: { select: { id: true, name: true, confidence: true } },
        documents: { select: { id: true, name: true, status: true } },
        studyPlans: { select: { id: true, name: true, totalDays: true } },
        _count: {
          select: {
            quizzes: true,
            flashcardDecks: true,
            mockExams: true
          }
        }
      },
      orderBy: { examDate: 'asc' }
    });

    res.json({ success: true, data: exams });
  } catch (error) {
    next(error);
  }
});

// GET single exam
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const exam = await prisma.exam.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: {
        subjects: true,
        topics: {
          include: {
            children: true,
            performance: true
          }
        },
        documents: true,
        studyPlans: { include: { tasks: true } },
        quizzes: true,
        flashcardDecks: true,
        mockExams: true
      }
    });

    if (!exam) {
      throw new AppError('NOT_FOUND', 'Exam not found');
    }

    res.json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
});

// POST create exam
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const validatedData = createExamSchema.parse(req.body);

    const exam = await prisma.exam.create({
      data: {
        ...validatedData,
        userId: req.user!.id
      }
    });

    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
});

// PATCH update exam
router.patch('/:id', async (req: AuthRequest, res, next) => {
  try {
    const validatedData = updateExamSchema.parse(req.body);

    const exam = await prisma.exam.findFirst({
      where: { id: req.params.id, userId: req.user!.id }
    });

    if (!exam) {
      throw new AppError('NOT_FOUND', 'Exam not found');
    }

    const updated = await prisma.exam.update({
      where: { id: req.params.id },
      data: validatedData
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE exam
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const exam = await prisma.exam.findFirst({
      where: { id: req.params.id, userId: req.user!.id }
    });

    if (!exam) {
      throw new AppError('NOT_FOUND', 'Exam not found');
    }

    await prisma.exam.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
