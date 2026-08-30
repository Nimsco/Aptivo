import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    
    // Get all user data for analytics
    const [exams, quizzes, flashcards, studySessions, mockExams] = await Promise.all([
      prisma.exam.findMany({ where: { userId }, include: { topics: true } }),
      prisma.quizAttempt.findMany({ where: { userId }, include: { quiz: true } }),
      prisma.flashcard.findMany({ where: { deck: { userId } } }),
      prisma.studySession.findMany({ where: { userId } }),
      prisma.mockExamAttempt.findMany({ where: { userId } })
    ]);
    
    // Calculate metrics
    const totalStudyTime = studySessions.reduce((acc, s) => acc + s.duration, 0);
    const avgQuizScore = quizzes.length > 0 
      ? Math.round(quizzes.reduce((acc, q) => acc + (q.score / q.totalQuestions) * 100, 0) / quizzes.length)
      : 0;
    const masteredTopics = exams.flatMap(e => e.topics).filter(t => t.confidence >= 80).length;
    
    // Calculate readiness score
    const readinessScore = calculateReadiness(exams, quizzes, flashcards, studySessions);
    
    res.json({
      success: true,
      data: {
        totalExams: exams.length,
        totalStudyTimeMinutes: totalStudyTime,
        avgQuizScore,
        masteredTopics,
        totalFlashcards: flashcards.length,
        totalQuizzes: quizzes.length,
        readinessScore,
        recentActivity: {
          quizzes: quizzes.slice(0, 5),
          studySessions: studySessions.slice(0, 5)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

function calculateReadiness(exams: any[], quizzes: any[], flashcards: any[], sessions: any[]): number {
  if (exams.length === 0) return 0;
  
  const topicConfidenceAvg = exams.flatMap(e => e.topics).reduce((acc, t) => acc + t.confidence, 0) / (exams.flatMap(e => e.topics).length || 1);
  const quizPerformance = quizzes.length > 0 ? quizzes.reduce((acc, q) => acc + (q.score / q.totalQuestions), 0) / quizzes.length : 0.5;
  const studyConsistency = Math.min(1, sessions.length / 10);
  
  return Math.round((topicConfidenceAvg * 0.4 + quizPerformance * 100 * 0.4 + studyConsistency * 100 * 0.2));
}

export default router;
