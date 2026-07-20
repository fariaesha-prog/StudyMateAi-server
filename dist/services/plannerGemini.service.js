"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlannerGeminiService = void 0;
const genai_1 = require("@google/genai");
const appError_1 = require("../utils/appError");
let _ai = null;
function getClient() {
    if (!_ai)
        _ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });
    return _ai;
}
const responseSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        days: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    dayOffset: { type: genai_1.Type.NUMBER },
                    focusTopics: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                    tasks: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                    estimatedHours: { type: genai_1.Type.NUMBER },
                },
                required: ['dayOffset', 'focusTopics', 'tasks', 'estimatedHours'],
            },
        },
        tips: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
    },
    required: ['days', 'tips'],
};
class PlannerGeminiService {
    static async generatePlan(examName, topics, totalDays) {
        if (!process.env.GEMINI_API_KEY) {
            throw new appError_1.AppError('AI service is not configured', 500);
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
                config: { responseMimeType: 'application/json', responseSchema: responseSchema },
            });
            return JSON.parse(response.text ?? '{}');
        }
        catch (error) {
            console.error('PLANNER GEMINI RAW ERROR:', error);
            throw new appError_1.AppError('Failed to generate study plan', 502);
        }
    }
}
exports.PlannerGeminiService = PlannerGeminiService;
