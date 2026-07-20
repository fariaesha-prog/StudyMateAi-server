"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizController = void 0;
const quiz_service_1 = require("../services/quiz.service");
const appError_1 = require("../utils/appError");
class QuizController {
    static async submit(req, res, next) {
        try {
            const { subject, score } = req.body;
            if (!subject || typeof score !== 'number') {
                throw new appError_1.AppError('subject and score are required', 400);
            }
            const quiz = await quiz_service_1.QuizService.submit(req.user.id, subject, score);
            res.status(201).json({ status: 'success', data: { quiz } });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.QuizController = QuizController;
