import { z } from 'zod';

// Schema for topic extraction
export const TopicExtractionSchema = z.object({
  topics: z.array(z.object({
    name: z.string(),
    description: z.string(),
    importance: z.number().min(1).max(100),
    difficulty: z.number().min(1).max(100),
    parentTopic: z.string().optional()
  }))
});

// Schema for study plan generation
export const StudyPlanSchema = z.object({
  summary: z.string(),
  topics: z.array(z.string()),
  days: z.array(z.object({
    date: z.string(),
    tasks: z.array(z.object({
      topicId: z.string(),
      type: z.enum(['learn', 'review', 'flashcards', 'quiz', 'mock_exam', 'practice']),
      title: z.string(),
      durationMinutes: z.number(),
      priority: z.enum(['low', 'medium', 'high', 'critical'])
    }))
  }))
});

// Schema for flashcard generation
export const FlashcardSchema = z.object({
  cards: z.array(z.object({
    topicId: z.string(),
    front: z.string(),
    back: z.string(),
    type: z.enum(['definition', 'explanation', 'comparison', 'application', 'scenario'])
  }))
});

// Schema for quiz generation
export const QuizSchema = z.object({
  questions: z.array(z.object({
    topicId: z.string(),
    type: z.enum(['multiple_choice', 'true_false', 'scenario', 'application', 'concept']),
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string(),
    explanation: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard'])
  }))
});

// Schema for document analysis
export const DocumentAnalysisSchema = z.object({
  text: z.string(),
  pageCount: z.number(),
  sections: z.array(z.object({
    title: z.string(),
    content: z.string(),
    pageNumber: z.number()
  }))
});

// Schema for summary generation
export const SummarySchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string()),
  importantTerms: z.array(z.object({
    term: z.string(),
    definition: z.string()
  }))
});

// Schema for topic explanation
export const TopicExplanationSchema = z.object({
  explanation: z.string(),
  examples: z.array(z.string()),
  commonMistakes: z.array(z.string()),
  relatedTopics: z.array(z.string())
});

// Schema for tutor response
export const TutorResponseSchema = z.object({
  response: z.string(),
  suggestedActions: z.array(z.string()),
  sources: z.array(z.string()).optional()
});
