import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

const createDeckSchema = z.object({
  examId: z.string().optional(),
  topicId: z.string().optional(),
  name: z.string().min(1)
});

router.post('/decks', async (req: AuthRequest, res, next) => {
  try {
    const validatedData = createDeckSchema.parse(req.body);
    
    const deck = await prisma.flashcardDeck.create({
      data: { ...validatedData, userId: req.user!.id }
    });
    
    res.status(201).json({ success: true, data: deck });
  } catch (error) {
    next(error);
  }
});

router.get('/decks', async (req: AuthRequest, res, next) => {
  try {
    const { examId } = req.query;
    const decks = await prisma.flashcardDeck.findMany({
      where: examId ? { examId: examId as string, userId: req.user!.id } : { userId: req.user!.id },
      include: { cards: true, exam: true }
    });
    res.json({ success: true, data: decks });
  } catch (error) {
    next(error);
  }
});

router.post('/cards', async (req: AuthRequest, res, next) => {
  try {
    const { deckId, front, back, cardType, topicId } = req.body;
    
    const card = await prisma.flashcard.create({
      data: { deckId, front, back, cardType, topicId }
    });
    
    res.status(201).json({ success: true, data: card });
  } catch (error) {
    next(error);
  }
});

router.post('/review', async (req: AuthRequest, res, next) => {
  try {
    const { cardId, rating } = req.body; // rating: again, hard, good, easy
    
    const card = await prisma.flashcard.findUnique({ where: { id: cardId } });
    if (!card) {
      throw new AppError('NOT_FOUND', 'Card not found');
    }

    // Simple spaced repetition algorithm
    let newInterval = 1;
    let newEase = card.easeFactor;
    
    switch (rating) {
      case 'again':
        newInterval = 1;
        newEase = Math.max(1.3, card.easeFactor - 0.2);
        break;
      case 'hard':
        newInterval = Math.ceil(card.interval * 1.2);
        newEase = Math.max(1.3, card.easeFactor - 0.15);
        break;
      case 'good':
        newInterval = Math.ceil(card.interval * card.easeFactor);
        break;
      case 'easy':
        newInterval = Math.ceil(card.interval * card.easeFactor * 1.3);
        newEase = Math.min(3.0, card.easeFactor + 0.15);
        break;
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);

    const updatedCard = await prisma.flashcard.update({
      where: { id: cardId },
      data: {
        interval: newInterval,
        easeFactor: newEase,
        repetition: card.repetition + 1,
        lastReviewed: new Date(),
        nextReview
      }
    });

    res.json({ success: true, data: updatedCard });
  } catch (error) {
    next(error);
  }
});

router.get('/due', async (req: AuthRequest, res, next) => {
  try {
    const now = new Date();
    const cards = await prisma.flashcard.findMany({
      where: {
        deck: { userId: req.user!.id },
        nextReview: { lte: now }
      },
      include: { deck: true, topic: true }
    });
    res.json({ success: true, data: cards });
  } catch (error) {
    next(error);
  }
});

export default router;
