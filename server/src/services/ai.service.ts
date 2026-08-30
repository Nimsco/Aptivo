import { createAIProvider } from '../providers';
import { 
  TopicExtractionSchema, 
  StudyPlanSchema, 
  FlashcardSchema, 
  QuizSchema, 
  SummarySchema, 
  TopicExplanationSchema, 
  TutorResponseSchema 
} from '../validators/ai.validators';
import type { 
  TopicExtractionResult, 
  StudyPlanResult, 
  FlashcardResult, 
  QuizResult, 
  SummaryResult, 
  TopicExplanationResult, 
  TutorResponseResult 
} from '../types/ai.types';

const aiProvider = createAIProvider();

// Document analysis prompt
const DOCUMENT_ANALYSIS_PROMPT = `Analyze the following document text and extract its structure.
Identify main sections, subsections, and key topics.
Return a structured JSON response with the extracted information.`;

// Topic extraction prompt
const TOPIC_EXTRACTION_PROMPT = `Extract all important topics from the following study material.
For each topic, provide:
- name: A clear, concise topic name
- description: Brief description of what the topic covers
- importance: How important this topic is for exam preparation (1-100)
- difficulty: Estimated difficulty level (1-100)
- parentTopic: Optional parent topic name if this is a subtopic

Organize topics hierarchically where appropriate.`;

// Study plan generation prompt
const STUDY_PLAN_PROMPT = `Create a comprehensive study plan based on the following information:
- Exam date and available study time
- List of topics with their importance and difficulty
- Student's current confidence levels

The plan should:
1. Prioritize high-importance topics
2. Allocate more time to difficult topics
3. Include regular review sessions
4. Balance learning new material with reviewing old material
5. Be realistic given the available time

Return a day-by-day plan with specific tasks.`;

// Flashcard generation prompt
const FLASHCARD_PROMPT = `Generate effective flashcards from the following study material.
Create cards that test understanding, not just memorization.
Include various types:
- definitions
- explanations
- comparisons between concepts
- application scenarios
- common mistakes to avoid

Avoid trivial questions like "What is the title of chapter X?"`;

// Quiz generation prompt
const QUIZ_GENERATION_PROMPT = `Create quiz questions based on the following study material.
Questions should:
1. Test understanding and application, not just recall
2. Include plausible distractors for multiple choice
3. Cover different difficulty levels
4. Provide clear explanations for why answers are correct/incorrect
5. Avoid ambiguous or tricky wording

Include a mix of question types appropriate for the subject matter.`;

// Summary generation prompt
const SUMMARY_PROMPT = `Create a concise summary of the following study material.
Include:
1. A brief overview summary
2. Key points that must be remembered
3. Important terms and their definitions

Focus on the most essential information for exam preparation.`;

// Topic explanation prompt
const TOPIC_EXPLANATION_PROMPT = `Provide a clear, educational explanation of the following topic.
Include:
1. A clear explanation suitable for a student
2. Concrete examples to illustrate the concept
3. Common mistakes students make
4. Related topics that should be studied together

Make the explanation engaging and easy to understand.`;

// Tutor response prompt
const TUTOR_RESPONSE_PROMPT = `You are an expert tutor helping a student prepare for their exam.
Base your responses primarily on the student's uploaded study material.
If information is not found in their materials, clearly state this.
Provide helpful, encouraging guidance.
Suggest concrete next steps for learning.`;

export async function analyzeDocument(text: string): Promise<string> {
  return aiProvider.generateText({
    prompt: `Document text:\n\n${text.substring(0, 10000)}`,
    systemPrompt: DOCUMENT_ANALYSIS_PROMPT,
    maxTokens: 2048
  });
}

export async function extractTopics(context: string): Promise<TopicExtractionResult> {
  return aiProvider.generateStructured(
    {
      prompt: `Study material:\n\n${context.substring(0, 8000)}`,
      systemPrompt: TOPIC_EXTRACTION_PROMPT,
      maxTokens: 2048
    },
    TopicExtractionSchema
  );
}

export async function generateStudyPlan(
  examDate: string,
  studyHoursPerDay: number,
  topics: Array<{ name: string; importance: number; difficulty: number }>,
  context: string
): Promise<StudyPlanResult> {
  const prompt = `
Exam Date: ${examDate}
Study Hours Per Day: ${studyHoursPerDay}

Topics:
${topics.map(t => `- ${t.name} (Importance: ${t.importance}, Difficulty: ${t.difficulty})`).join('\n')}

Context: ${context.substring(0, 5000)}
`;

  return aiProvider.generateStructured(
    {
      prompt,
      systemPrompt: STUDY_PLAN_PROMPT,
      maxTokens: 4096
    },
    StudyPlanSchema
  );
}

export async function generateFlashcards(
  topicName: string,
  context: string
): Promise<FlashcardResult> {
  return aiProvider.generateStructured(
    {
      prompt: `Topic: ${topicName}\n\nStudy material:\n\n${context.substring(0, 6000)}`,
      systemPrompt: FLASHCARD_PROMPT,
      maxTokens: 3072
    },
    FlashcardSchema
  );
}

export async function generateQuiz(
  topicName: string,
  questionCount: number,
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed',
  context: string
): Promise<QuizResult> {
  return aiProvider.generateStructured(
    {
      prompt: `Topic: ${topicName}\nNumber of Questions: ${questionCount}\nDifficulty: ${difficulty}\n\nStudy material:\n\n${context.substring(0, 8000)}`,
      systemPrompt: QUIZ_GENERATION_PROMPT,
      maxTokens: 4096
    },
    QuizSchema
  );
}

export async function generateSummary(context: string): Promise<SummaryResult> {
  return aiProvider.generateStructured(
    {
      prompt: `Study material to summarize:\n\n${context.substring(0, 8000)}`,
      systemPrompt: SUMMARY_PROMPT,
      maxTokens: 2048
    },
    SummarySchema
  );
}

export async function generateTopicExplanation(
  topicName: string,
  context: string
): Promise<TopicExplanationResult> {
  return aiProvider.generateStructured(
    {
      prompt: `Explain this topic: ${topicName}\n\nRelated study material:\n\n${context.substring(0, 6000)}`,
      systemPrompt: TOPIC_EXPLANATION_PROMPT,
      maxTokens: 3072
    },
    TopicExplanationSchema
  );
}

export async function generateTutorResponse(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  context: string
): Promise<TutorResponseResult> {
  const historyText = conversationHistory
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');

  return aiProvider.generateStructured(
    {
      prompt: `Conversation:\n${historyText}\n\nUser: ${userMessage}\n\nStudy material context:\n${context.substring(0, 4000)}`,
      systemPrompt: TUTOR_RESPONSE_PROMPT,
      maxTokens: 2048
    },
    TutorResponseSchema
  );
}
