import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

router.post('/generate', async (req: AuthRequest, res, next) => {
  try {
    const { examId } = req.body;
    
    const exam = await prisma.exam.findFirst({
      where: { id: examId, userId: req.user!.id },
      include: { topics: true }
    });

    if (!exam) {
      throw new AppError('NOT_FOUND', 'Exam not found');
    }

    const startDate = new Date();
    const endDate = new Date(exam.examDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Create study plan
    const plan = await prisma.studyPlan.create({
      data: {
        examId,
        name: `Study Plan for ${exam.name}`,
        startDate,
        endDate,
        totalDays,
        summary: `Generated plan covering ${exam.topics.length} topics over ${totalDays} days`
      }
    });

    // Generate tasks based on topics
    const tasks = [];
    const topicsPerDay = Math.ceil(exam.topics.length / totalDays) || 1;
    
    for (let day = 0; day < totalDays && day < exam.topics.length; day++) {
      const topic = exam.topics[day];
      const scheduledDate = new Date(startDate);
      scheduledDate.setDate(startDate.getDate() + day);
      
      tasks.push({
        studyPlanId: plan.id,
        topicId: topic.id,
        type: 'learn' as const,
        title: `Study ${topic.name}`,
        durationMinutes: 25,
        priority: topic.importance > 70 ? 'high' : 'medium',
        scheduledDate,
        order: day
      });
    }

    if (tasks.length > 0) {
      await prisma.studyTask.createMany({ data: tasks });
    }

    const updatedPlan = await prisma.studyPlan.findUnique({
      where: { id: plan.id },
      include: { tasks: { include: { topic: true } } }
    });

    res.json({ success: true, data: updatedPlan });
  } catch (error) {
    next(error);
  }
});

router.get('/:examId', async (req: AuthRequest, res, next) => {
  try {
    const plans = await prisma.studyPlan.findMany({
      where: { examId: req.params.examId },
      include: { tasks: { include: { topic: true } }, exam: true }
    });
    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
});

router.patch('/tasks/:taskId', async (req: AuthRequest, res, next) => {
  try {
    const { taskId } = req.params;
    const { status, completedAt } = req.body;
    
    const task = await prisma.studyTask.update({
      where: { id: taskId },
      data: { status, completedAt: completedAt ? new Date(completedAt) : undefined }
    });
    
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
});

export default router;
