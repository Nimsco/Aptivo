import { z } from 'zod';
import fetch from 'node-fetch';
import { AIProvider, GenerateTextInput, StructuredGenerationInput } from '../types/ai.types';

export class OpenAICompatibleProvider implements AIProvider {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    this.model = process.env.AI_MODEL || 'gpt-4o-mini';
  }

  async generateText(input: GenerateTextInput): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const messages: any[] = [
      { role: 'system', content: input.systemPrompt || 'You are a helpful assistant.' }
    ];

    if (input.context) {
      messages.push({ role: 'system', content: `Context: ${input.context}` });
    }

    messages.push({ role: 'user', content: input.prompt });

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: input.temperature || 0.7,
          max_tokens: input.maxTokens || 2048
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAICompatibleProvider error:', error);
      throw new Error(`Failed to generate text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateStructured<T>(
    input: StructuredGenerationInput,
    schema: z.ZodSchema<T>
  ): Promise<T> {
    const systemPrompt = input.systemPrompt 
      ? `${input.systemPrompt}\n\nIMPORTANT: You must respond with valid JSON only. No markdown, no explanations outside the JSON.`
      : 'You must respond with valid JSON only. No markdown, no explanations outside the JSON.';

    const prompt = `${input.prompt}\n\nRespond with valid JSON matching the expected schema.`;

    let retries = 2;
    let lastError: Error | null = null;

    while (retries > 0) {
      try {
        const text = await this.generateText({
          ...input,
          prompt,
          systemPrompt,
          temperature: 0.3 // Lower temperature for more consistent structured output
        });

        // Try to parse JSON from the response
        let jsonText = text.trim();
        
        // Remove markdown code blocks if present
        jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        
        const parsed = JSON.parse(jsonText);
        
        // Validate against schema
        return schema.parse(parsed);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.warn(`Structured generation failed, retries left: ${retries - 1}`, lastError.message);
        retries--;
        
        if (retries === 0) {
          throw new Error(`Failed to generate valid structured data after retries: ${lastError.message}`);
        }
      }
    }

    throw new Error('Failed to generate structured data');
  }
}
