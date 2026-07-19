import { GoogleGenAI, Type } from '@google/genai';
import { AppError } from '../utils/appError';

let _ai: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (!_ai) _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });
  return _ai;
}

interface PlanDayResult {
  dayOffset: number;
  focusTopics: string[];
  tasks: string[];
  estimatedHours: number;
}

interface PlanGenerationResult {
  days: PlanDayResult[];
  tips: string[];
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayOffset: { type: Type.NUMBER },
          focusTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
          tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
          estimatedHours: { type: Type.NUMBER },
        },
        required: ['dayOffset', 'focusTopics', 'tasks', 'estimatedHours'],
      },
    },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['days', 'tips'],
};

export class PlannerGeminiService {
  public static async generatePlan(
    examName: string,
    topics: string[],
    totalDays: number
  ): Promise<PlanGenerationResult> {
    if (!process.env.GEMINI_API_KEY) {
      throw new AppError('AI service is not configured', 500);
    }

    const prompt = `You are an expert academic study planner. Create a day-by-day study plan.

Exam: "${examName}"
Topics to cover: ${topics.join(', ')}
Number of days available (including today, day 0, up to and including the day before the exam): ${totalDays}

Rules:
- Return exactly ${totalDays} day entries, with dayOffset from 0 (today) to ${totalDays - 1}.
- Distribute topics evenly, spending more time on topics that sound harder or more complex first.
- Include at least one dedicated revision/practice-quiz day near the end.
- The last day (dayOffset ${totalDays - 1}) should be light review only, not new material.
- Each day: 2-4 short, specific tasks and a realistic estimatedHours (1-5).
- tips: 3-5 general exam prep tips relevant to these topics.`;

    try {
      const response = await getClient().models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: responseSchema as any },
      });
      return JSON.parse(response.text ?? '{}') as PlanGenerationResult;
    } catch (error) {
      console.error('PLANNER GEMINI RAW ERROR:', error);
      throw new AppError('Failed to generate study plan', 502);
    }
  }
}