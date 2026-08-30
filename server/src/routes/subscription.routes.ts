import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { userId: req.user!.id }
    });
    
    const usage = await prisma.usageRecord.findMany({
      where: { userId: req.user!.id, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
    });
    
    res.json({
      success: true,
      data: {
        subscription: subscription || { plan: 'free', status: 'active' },
        usage: {
          aiRequests: usage.filter(u => u.action === 'ai_request').length,
          documentsUploaded: usage.filter(u => u.action === 'document_upload').length,
          quizzesGenerated: usage.filter(u => u.action === 'quiz_generation').length
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
