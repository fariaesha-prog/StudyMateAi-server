import { GoogleGenAI } from '@google/genai';
import { AppError } from '../utils/appError';

let _ai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });
  }
  return _ai;
}

interface HistoryTurn {
  role: 'user' | 'assistant';
  message: string;
}

export class ChatGeminiService {
  public static async reply(
    userMessage: string,
    history: HistoryTurn[],
    documentContext?: string
  ): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      throw new AppError('AI service is not configured', 500);
    }

    const contents = [
      ...history.map((turn) => ({
        role: turn.role === 'assistant' ? ('model' as const) : ('user' as const),
        parts: [{ text: turn.message }],
      })),
      { role: 'user' as const, parts: [{ text: userMessage }] },
    ];

    const systemInstruction = documentContext
      ? `You are Lumio, a friendly and knowledgeable AI study tutor. The student has an uploaded document as context. Use it to ground your answers when relevant, and cite concepts from it naturally. If the question is unrelated to the document, just answer it normally as a helpful tutor.\n\nDocument content:\n"""${documentContext.slice(0, 20000)}"""`
      : `You are Lumio, a friendly and knowledgeable AI study tutor. Answer the student's questions clearly and helpfully, using examples where useful.`;

    try {
      const response = await getClient().models.generateContent({
        model: 'gemini-flash-latest',
        contents,
        config: { systemInstruction },
      });
      return response.text ?? "Sorry, I couldn't generate a response.";
    } catch (error) {
      console.error('CHAT GEMINI RAW ERROR:', error);
      throw new AppError('Failed to get AI response', 502);
    }
  }
}