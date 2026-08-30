import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@aptivo.com' },
    update: {},
    create: {
      email: 'demo@aptivo.com',
      password: hashedPassword,
      name: 'Alex Morgan',
      studyField: 'Computer Science',
      timezone: 'UTC'
    }
  });

  console.log('✓ Created demo user: demo@aptivo.com');

  // Create exam
  const examDate = new Date();
  examDate.setDate(examDate.getDate() + 18);

  const exam = await prisma.exam.create({
    data: {
      userId: user.id,
      name: 'Database Systems',
      module: 'CS301',
      examDate,
      targetGrade: 'Excellent',
      studyHoursPerDay: 3,
      description: 'Final exam covering all database concepts',
      topics: {
        create: [
          { name: 'Relational Model', importance: 80, difficulty: 60, confidence: 75 },
          { name: 'SQL Basics', importance: 90, difficulty: 40, confidence: 85 },
          { name: 'Database Normalization', importance: 85, difficulty: 70, confidence: 42 },
          { name: 'SQL Joins', importance: 88, difficulty: 65, confidence: 61 },
          { name: 'Transactions', importance: 75, difficulty: 75, confidence: 67 },
          { name: 'Indexes', importance: 70, difficulty: 55, confidence: 78 },
          { name: 'ER Diagrams', importance: 65, difficulty: 45, confidence: 82 }
        ]
      }
    }
  });

  console.log('✓ Created exam: Database Systems');

  // Create flashcard deck
  const deck = await prisma.flashcardDeck.create({
    data: {
      userId: user.id,
      examId: exam.id,
      name: 'Database Fundamentals',
      cards: {
        create: [
          { front: 'What is a primary key?', back: 'A unique identifier for each record in a table.', cardType: 'definition' },
          { front: 'What is the difference between INNER JOIN and LEFT JOIN?', back: 'INNER JOIN returns only matching rows, LEFT JOIN returns all rows from left table plus matches.', cardType: 'comparison' },
          { front: 'What is normalization?', back: 'The process of organizing data to reduce redundancy and improve integrity.', cardType: 'explanation' },
          { front: 'What is 3NF?', back: 'Third Normal Form: A table is in 3NF if it is in 2NF and has no transitive dependencies.', cardType: 'definition' }
        ]
      }
    }
  });

  console.log('✓ Created flashcard deck');

  // Create quiz
  const quiz = await prisma.quiz.create({
    data: {
      userId: user.id,
      examId: exam.id,
      name: 'SQL Basics Quiz',
      questionCount: 10,
      difficulty: 'mixed',
      questions: {
        create: [
          { 
            type: 'multiple_choice',
            question: 'Which SQL keyword is used to retrieve data?',
            options: JSON.stringify(['GET', 'SELECT', 'FETCH', 'RETRIEVE']),
            correctAnswer: 'SELECT',
            explanation: 'SELECT is the standard SQL command for querying data.'
          },
          {
            type: 'multiple_choice',
            question: 'What does JOIN do?',
            options: JSON.stringify(['Combines tables', 'Deletes data', 'Creates index', 'Updates records']),
            correctAnswer: 'Combines tables',
            explanation: 'JOIN combines rows from two or more tables based on related columns.'
          }
        ]
      }
    }
  });

  console.log('✓ Created quiz');

  // Create study plan
  const startDate = new Date();
  const endDate = new Date(examDate);
  
  const plan = await prisma.studyPlan.create({
    data: {
      examId: exam.id,
      name: 'Database Systems Study Plan',
      startDate,
      endDate,
      totalDays: 18,
      summary: 'Comprehensive study plan covering all database topics',
      tasks: {
        create: [
          { type: 'learn', title: 'Review SQL Basics', durationMinutes: 25, priority: 'high', scheduledDate: startDate },
          { type: 'quiz', title: 'SQL Practice Quiz', durationMinutes: 20, priority: 'medium', scheduledDate: new Date(startDate.getTime() + 24*60*60*1000) },
          { type: 'review', title: 'Normalization Review', durationMinutes: 30, priority: 'high', scheduledDate: new Date(startDate.getTime() + 2*24*60*60*1000) },
          { type: 'flashcards', title: 'Database Terms Flashcards', durationMinutes: 15, priority: 'medium', scheduledDate: new Date(startDate.getTime() + 3*24*60*60*1000) }
        ]
      }
    }
  });

  console.log('✓ Created study plan');

  // Create topic performance records
  const topics = await prisma.topic.findMany({ where: { examId: exam.id } });
  for (const topic of topics) {
    await prisma.topicPerformance.upsert({
      where: { topicId: topic.id },
      update: {},
      create: {
        topicId: topic.id,
        quizAccuracy: topic.confidence * 0.9,
        flashcardAccuracy: topic.confidence * 0.85,
        reviewCount: Math.floor(Math.random() * 10),
        mistakeCount: Math.floor(Math.random() * 5),
        lastStudied: new Date(),
        strength: topic.confidence < 50 ? 'critical' : topic.confidence < 70 ? 'weak' : topic.confidence < 85 ? 'needs_review' : 'strong'
      }
    });
  }

  console.log('✓ Created topic performance records');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
