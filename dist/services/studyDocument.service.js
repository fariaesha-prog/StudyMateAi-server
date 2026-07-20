"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyDocumentService = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const studyDocument_model_1 = require("../models/studyDocument.model");
const textExtraction_service_1 = require("./textExtraction.service");
const gemini_service_1 = require("./gemini.service");
const appError_1 = require("../utils/appError");
const studySession_service_1 = require("./studySession.service");
class StudyDocumentService {
    static async createFromUpload(userId, file, title) {
        const uploadsDir = path_1.default.join(__dirname, '..', 'uploads', 'documents');
        await promises_1.default.mkdir(uploadsDir, { recursive: true });
        const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
        await promises_1.default.writeFile(path_1.default.join(uploadsDir, filename), file.buffer);
        const fileUrl = `/uploads/documents/${filename}`;
        const extractedText = await textExtraction_service_1.TextExtractionService.extract(file.buffer, file.mimetype);
        const doc = await studyDocument_model_1.StudyDocument.create({
            user: userId,
            title: title?.trim() || file.originalname,
            filename,
            fileUrl,
            mimeType: file.mimetype,
            extractedText,
            status: 'processing',
        });
        try {
            const aiResult = await gemini_service_1.GeminiService.generateStudyMaterial(extractedText);
            doc.summary = aiResult.summary;
            doc.concepts = aiResult.concepts;
            doc.importantTopics = aiResult.importantTopics;
            doc.flashcards = aiResult.flashcards;
            doc.quiz = aiResult.quiz;
            doc.revisionTips = aiResult.revisionTips;
            doc.status = 'ready';
            await doc.save();
            await studySession_service_1.StudySessionService.logActivity(userId, 5);
        }
        catch (error) {
            doc.status = 'failed';
            doc.errorMessage = error instanceof appError_1.AppError ? error.message : 'AI generation failed';
            await doc.save();
            throw error;
        }
        return doc;
    }
    static async getById(id, userId) {
        const doc = await studyDocument_model_1.StudyDocument.findById(id);
        if (!doc)
            throw new appError_1.AppError('Document not found', 404);
        if (doc.user.toString() !== userId)
            throw new appError_1.AppError('Not authorized to view this document', 403);
        return doc;
    }
}
exports.StudyDocumentService = StudyDocumentService;
