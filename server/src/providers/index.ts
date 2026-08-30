import { AIProvider } from '../types/ai.types';
import { MockProvider } from './MockProvider';
import { QwenProvider } from './QwenProvider';
import { OpenAICompatibleProvider } from './OpenAICompatibleProvider';

export function createAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || 'mock';

  switch (provider) {
    case 'qwen':
      console.log('[AI] Using Qwen provider');
      return new QwenProvider();
    
    case 'openai-compatible':
      console.log('[AI] Using OpenAI-compatible provider');
      return new OpenAICompatibleProvider();
    
    case 'mock':
    default:
      console.log('[AI] Using Mock provider (development mode)');
      return new MockProvider();
  }
}
