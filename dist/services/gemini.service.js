"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const genai_1 = require("@google/genai");
const appError_1 = require("../utils/appError");
let _ai = null;
function getClient() {
    if (!_ai) {
        _ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });
    }
    return _ai;
}
const responseSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        summary: { type: genai_1.Type.STRING },
        concepts: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    title: { type: genai_1.Type.STRING },
                    explanation: { type: genai_1.Type.STRING },
                },
                required: ['title', 'explanation'],
            },
        },
        importantTopics: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        flashcards: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    question: { type: genai_1.Type.STRING },
                    answer: { type: genai_1.Type.STRING },
                },
                required: ['question', 'answer'],
            },
        },
        quiz: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    question: { type: genai_1.Type.STRING },
                    options: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                    correctAnswer: { type: genai_1.Type.NUMBER },
                    explanation: { type: genai_1.Type.STRING },
                },
                required: ['question', 'options', 'correctAnswer', 'explanation'],
            },
        },
        revisionTips: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
    },
    required: ['summary', 'concepts', 'importantTopics', 'flashcards', 'quiz', 'revisionTips'],
};
class GeminiService {
    static async generateStudyMaterial(extractedText) {
        if (!process.env.GEMINI_API_KEY) {
            throw new appError_1.AppError('AI service is not configured', 500);
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
                    responseSchema: responseSchema,
                },
            });
            return JSON.parse(response.text ?? '{}');
        }
        catch (error) {
            console.error('GEMINI RAW ERROR:', error);
            throw new appError_1.AppError('Failed to generate AI study material', 502);
        }
    }
}
exports.GeminiService = GeminiService;
