import { z } from 'zod';

export interface GenerateTextInput {
  prompt: string;
  context?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface StructuredGenerationInput {
  prompt: string;
  context?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  generateText(input: GenerateTextInput): Promise<string>;
  generateStructured<T>(
    input: StructuredGenerationInput,
    schema: z.ZodSchema<T>
  ): Promise<T>;
}

export interface DocumentAnalysisResult {
  text: string;
  pageCount: number;
  sections: Array<{
    title: string;
    content: string;
    pageNumber: number;
  }>;
}

export interface TopicExtractionResult {
  topics: Array<{
    name: string;
    description: string;
    importance: number;
    difficulty: number;
    parentTopic?: string;
  }>;
}

export interface StudyPlanResult {
  summary: string;
  topics: string[];
  days: Array<{
    date: string;
    tasks: Array<{
      topicId: string;
      type: 'learn' | 'review' | 'flashcards' | 'quiz' | 'mock_exam' | 'practice';
      title: string;
      durationMinutes: number;
      priority: 'low' | 'medium' | 'high' | 'critical';
    }>;
  }>;
}

export interface FlashcardResult {
  cards: Array<{
    topicId: string;
    front: string;
    back: string;
    type: 'definition' | 'explanation' | 'comparison' | 'application' | 'scenario';
  }>;
}

export interface QuizResult {
  questions: Array<{
    topicId: string;
    type: 'multiple_choice' | 'true_false' | 'scenario' | 'application' | 'concept';
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
}

export interface MockExamResult {
  name: string;
  questions: Array<{
    topicId: string;
    type: 'multiple_choice' | 'true_false' | 'scenario' | 'application' | 'concept';
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
}

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  importantTerms: Array<{ term: string; definition: string }>;
}

export interface TopicExplanationResult {
  explanation: string;
  examples: string[];
  commonMistakes: string[];
  relatedTopics: string[];
}

export interface TutorResponseResult {
  response: string;
  suggestedActions: string[];
  sources?: string[];
}
