"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGeminiService = void 0;
const genai_1 = require("@google/genai");
const appError_1 = require("../utils/appError");
let _ai = null;
function getClient() {
    if (!_ai) {
        _ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });
    }
    return _ai;
}
class ChatGeminiService {
    static async reply(userMessage, history, documentContext) {
        if (!process.env.GEMINI_API_KEY) {
            throw new appError_1.AppError('AI service is not configured', 500);
        }
        const contents = [
            ...history.map((turn) => ({
                role: turn.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: turn.message }],
            })),
            { role: 'user', parts: [{ text: userMessage }] },
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
        }
        catch (error) {
            console.error('CHAT GEMINI RAW ERROR:', error);
            throw new appError_1.AppError('Failed to get AI response', 502);
        }
    }
}
exports.ChatGeminiService = ChatGeminiService;
