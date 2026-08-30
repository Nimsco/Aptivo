import { z } from 'zod';
import { AIProvider, GenerateTextInput, StructuredGenerationInput } from '../types/ai.types';

export class MockProvider implements AIProvider {
  async generateText(input: GenerateTextInput): Promise<string> {
    console.log('[MockProvider] Generating text:', input.prompt.substring(0, 50) + '...');
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return `This is a mock response. In production, this would call the actual AI provider.\n\nContext provided: ${input.context ? 'Yes' : 'No'}\nPrompt: ${input.prompt.substring(0, 100)}...`;
  }

  async generateStructured<T>(
    input: StructuredGenerationInput,
    schema: z.ZodSchema<T>
  ): Promise<T> {
    console.log('[MockProvider] Generating structured data:', input.prompt.substring(0, 50) + '...');
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data based on common schemas
    const mockData: any = {};
    
    // Try to infer what kind of data is needed based on the prompt
    const prompt = input.prompt.toLowerCase();
    
    if (prompt.includes('topic') || prompt.includes('extract')) {
      mockData.topics = [
        { name: 'Introduction', description: 'Basic concepts', importance: 80, difficulty: 30 },
        { name: 'Core Concepts', description: 'Main principles', importance: 90, difficulty: 60 },
        { name: 'Advanced Topics', description: 'Complex applications', importance: 70, difficulty: 85 }
      ];
    } else if (prompt.includes('study plan') || prompt.includes('schedule')) {
      mockData.summary = 'A comprehensive study plan covering all topics';
      mockData.topics = ['Topic 1', 'Topic 2', 'Topic 3'];
      mockData.days = [
        {
          date: new Date().toISOString().split('T')[0],
          tasks: [
            { topicId: '1', type: 'learn' as const, title: 'Study basics', durationMinutes: 25, priority: 'high' as const },
            { topicId: '2', type: 'review' as const, title: 'Review notes', durationMinutes: 15, priority: 'medium' as const }
          ]
        }
      ];
    } else if (prompt.includes('flashcard')) {
      mockData.cards = [
        { topicId: '1', front: 'What is X?', back: 'X is a fundamental concept...', type: 'definition' as const },
        { topicId: '2', front: 'How does Y work?', back: 'Y works by...', type: 'explanation' as const }
      ];
    } else if (prompt.includes('quiz') || prompt.includes('question')) {
      mockData.questions = [
        {
          topicId: '1',
          type: 'multiple_choice' as const,
          question: 'What is the correct answer?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option B',
          explanation: 'Option B is correct because...',
          difficulty: 'medium' as const
        }
      ];
    } else if (prompt.includes('summary') || prompt.includes('summarize')) {
      mockData.summary = 'This document covers key concepts in the subject area.';
      mockData.keyPoints = ['Point 1', 'Point 2', 'Point 3'];
      mockData.importantTerms = [{ term: 'Key Term', definition: 'Definition of the term' }];
    } else if (prompt.includes('explain') || prompt.includes('tutor')) {
      mockData.response = 'Here\'s an explanation of the concept...';
      mockData.suggestedActions = ['Review related topics', 'Practice with examples', 'Take a quiz'];
    } else {
      // Default mock response
      mockData.result = 'Mock generated content based on your input.';
    }
    
    try {
      return schema.parse(mockData);
    } catch (error) {
      console.warn('[MockProvider] Schema validation failed, returning raw mock data');
      return mockData as T;
    }
  }
}
