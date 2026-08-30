import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import examRoutes from './routes/exam.routes';
import topicRoutes from './routes/topic.routes';
import documentRoutes from './routes/document.routes';
import studyPlanRoutes from './routes/studyPlan.routes';
import flashcardRoutes from './routes/flashcard.routes';
import quizRoutes from './routes/quiz.routes';
import mockExamRoutes from './routes/mockExam.routes';
import tutorRoutes from './routes/tutor.routes';
import analyticsRoutes from './routes/analytics.routes';
import userRoutes from './routes/user.routes';
import subscriptionRoutes from './routes/subscription.routes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', authMiddleware, examRoutes);
app.use('/api/topics', authMiddleware, topicRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);
app.use('/api/study-plans', authMiddleware, studyPlanRoutes);
app.use('/api/flashcards', authMiddleware, flashcardRoutes);
app.use('/api/quizzes', authMiddleware, quizRoutes);
app.use('/api/mock-exams', authMiddleware, mockExamRoutes);
app.use('/api/tutor', authMiddleware, tutorRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/subscription', authMiddleware, subscriptionRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Aptivo server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 AI Provider: ${process.env.AI_PROVIDER || 'mock'}`);
});

export default app;
