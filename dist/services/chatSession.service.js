"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSessionService = void 0;
const chatSession_model_1 = require("../models/chatSession.model");
const chatMessage_model_1 = require("../models/chatMessage.model");
const studyDocument_model_1 = require("../models/studyDocument.model");
const chatGemini_service_1 = require("./chatGemini.service");
const appError_1 = require("../utils/appError");
class ChatSessionService {
    static async listSessions(userId) {
        return chatSession_model_1.ChatSession.find({ user: userId }).sort({ updatedAt: -1 });
    }
    static async createSession(userId, documentId, title) {
        let doc = null;
        if (documentId) {
            doc = await studyDocument_model_1.StudyDocument.findById(documentId);
            if (!doc)
                throw new appError_1.AppError('Document not found', 404);
            if (doc.user.toString() !== userId)
                throw new appError_1.AppError('Not authorized to use this document', 403);
        }
        return chatSession_model_1.ChatSession.create({
            user: userId,
            title: title?.trim() || doc?.title || 'New conversation',
            document: doc?._id,
        });
    }
    static async getMessages(sessionId, userId) {
        const session = await chatSession_model_1.ChatSession.findById(sessionId);
        if (!session)
            throw new appError_1.AppError('Conversation not found', 404);
        if (session.user.toString() !== userId)
            throw new appError_1.AppError('Not authorized', 403);
        const messages = await chatMessage_model_1.ChatMessage.find({ session: sessionId }).sort({ createdAt: 1 });
        return { session, messages };
    }
    static async sendMessage(sessionId, userId, message) {
        const session = await chatSession_model_1.ChatSession.findById(sessionId);
        if (!session)
            throw new appError_1.AppError('Conversation not found', 404);
        if (session.user.toString() !== userId)
            throw new appError_1.AppError('Not authorized', 403);
        const history = await chatMessage_model_1.ChatMessage.find({ session: sessionId }).sort({ createdAt: 1 }).limit(20);
        await chatMessage_model_1.ChatMessage.create({ session: sessionId, user: userId, role: 'user', message });
        let documentContext;
        if (session.document) {
            const doc = await studyDocument_model_1.StudyDocument.findById(session.document);
            documentContext = doc?.extractedText;
        }
        const reply = await chatGemini_service_1.ChatGeminiService.reply(message, history.map((h) => ({ role: h.role, message: h.message })), documentContext);
        const assistantMsg = await chatMessage_model_1.ChatMessage.create({
            session: sessionId,
            user: userId,
            role: 'assistant',
            message: reply,
        });
        return assistantMsg;
    }
    static async attachDocument(sessionId, userId, documentId) {
        const session = await chatSession_model_1.ChatSession.findById(sessionId);
        if (!session)
            throw new appError_1.AppError('Conversation not found', 404);
        if (session.user.toString() !== userId)
            throw new appError_1.AppError('Not authorized', 403);
        const doc = await studyDocument_model_1.StudyDocument.findById(documentId);
        if (!doc)
            throw new appError_1.AppError('Document not found', 404);
        if (doc.user.toString() !== userId)
            throw new appError_1.AppError('Not authorized to use this document', 403);
        session.document = doc._id;
        await session.save();
        return session;
    }
}
exports.ChatSessionService = ChatSessionService;
