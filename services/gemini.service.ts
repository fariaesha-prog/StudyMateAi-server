import { GoogleGenAI, Type } from '@google/genai';
import { AppError } from '../utils/appError';
import { GeminiStudyResponse } from '../types/ai.interface';
let _ai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });
  }
  return _ai;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    concepts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ['title', 'explanation'],
      },
    },
    importantTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
        },
        required: ['question', 'answer'],
      },
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.NUMBER },
          explanation: { type: Type.STRING },
        },
        required: ['question', 'options', 'correctAnswer', 'explanation'],
      },
    },
    revisionTips: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['summary', 'concepts', 'importantTopics', 'flashcards', 'quiz', 'revisionTips'],
};

export class GeminiService {
  public static async generateStudyMaterial(extractedText: string): Promise<GeminiStudyResponse> {
    if (!process.env.GEMINI_API_KEY) {
      throw new AppError('AI service is not configured', 500);
    }

    const prompt = `You are an expert study tutor. Analyze the following study material and generate structured learning content.

Requirements:
- summary: a clear, concise overview (3-5 sentences)
- concepts: 4-8 key concepts, each with a short title and a plain-language explanation
- importantTopics: 5-10 important topic names as short strings
- flashcards: 8-12 question/answer pairs for active recall
- quiz: exactly 10 multiple-choice questions, each with 4 options, a zero-indexed correctAnswer, and a short explanation
- revisionTips: 4-6 actionable tips for revising this material

Study material:
"""
${extractedText.slice(0, 30000)}
"""`;

    try {
      const response = await getClient().models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema as any,
        },
      });

      return JSON.parse(response.text ?? '{}') as GeminiStudyResponse;
    } catch (error) {
      console.error('GEMINI RAW ERROR:', error);
      throw new AppError('Failed to generate AI study material', 502);
    }
  }
}