"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const studyDocument_service_1 = require("../services/studyDocument.service");
const appError_1 = require("../utils/appError");
class AiController {
    static async upload(req, res, next) {
        try {
            if (!req.file) {
                throw new appError_1.AppError('No file uploaded', 400);
            }
            const doc = await studyDocument_service_1.StudyDocumentService.createFromUpload(req.user.id, req.file, req.body.title);
            res.status(201).json({
                status: 'success',
                data: {
                    documentId: doc._id,
                    title: doc.title,
                    summary: doc.summary,
                    concepts: doc.concepts,
                    importantTopics: doc.importantTopics,
                    flashcards: doc.flashcards,
                    quiz: doc.quiz,
                    revisionTips: doc.revisionTips,
                    status: doc.status,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const doc = await studyDocument_service_1.StudyDocumentService.getById(req.params.id, req.user.id);
            res.status(200).json({ status: 'success', data: { document: doc } });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AiController = AiController;
