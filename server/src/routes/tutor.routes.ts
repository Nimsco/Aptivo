import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

router.post('/sessions', async (req: AuthRequest, res, next) => {
  try {
    const { examId, topicId, title } = req.body;
    
    const session = await prisma.chatSession.create({
      data: { userId: req.user!.id, examId, topicId, title }
    });
    
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
});

router.get('/sessions', async (req: AuthRequest, res, next) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: req.user!.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ success: true, data: sessions });
  } catch (error) {
    next(error);
  }
});

router.post('/chat', async (req: AuthRequest, res, next) => {
  try {
    const { sessionId, content, context } = req.body;
    
    if (!sessionId) {
      throw new AppError('INVALID_REQUEST', 'Session ID required');
    }
    
    // Save user message
    await prisma.chatMessage.create({
      data: { sessionId, role: 'user', content }
    });
    
    // Generate AI response (using mock for now)
    const aiResponse = generateMockResponse(content, context);
    
    // Save AI response
    const message = await prisma.chatMessage.create({
      data: { sessionId, role: 'assistant', content: aiResponse, context }
    });
    
    // Update session timestamp
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() }
    });
    
    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
});

function generateMockResponse(userMessage: string, context?: any): string {
  const responses = [
    "That's a great question! Let me explain based on your study materials...",
    "Based on the topics you're studying, here's what you need to know...",
    "I can help with that. Let me break this down into simpler terms...",
    "This concept relates to what you've been studying. Here's how it connects..."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

export default router;
