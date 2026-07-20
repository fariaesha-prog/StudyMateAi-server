"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chatSession_service_1 = require("../services/chatSession.service");
class ChatController {
    static async listSessions(req, res, next) {
        try {
            const sessions = await chatSession_service_1.ChatSessionService.listSessions(req.user.id);
            res.status(200).json({ status: 'success', data: { sessions } });
        }
        catch (error) {
            next(error);
        }
    }
    static async createSession(req, res, next) {
        try {
            const session = await chatSession_service_1.ChatSessionService.createSession(req.user.id, req.body.documentId, req.body.title);
            res.status(201).json({ status: 'success', data: { session } });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMessages(req, res, next) {
        try {
            const result = await chatSession_service_1.ChatSessionService.getMessages(req.params.sessionId, req.user.id);
            res.status(200).json({ status: 'success', data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async sendMessage(req, res, next) {
        try {
            const assistantMessage = await chatSession_service_1.ChatSessionService.sendMessage(req.params.sessionId, req.user.id, req.body.message);
            res.status(200).json({ status: 'success', data: { message: assistantMessage } });
        }
        catch (error) {
            next(error);
        }
    }
    static async attachDocument(req, res, next) {
        try {
            const session = await chatSession_service_1.ChatSessionService.attachDocument(req.params.sessionId, req.user.id, req.body.documentId);
            res.status(200).json({ status: 'success', data: { session } });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ChatController = ChatController;
