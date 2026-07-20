"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const quiz_model_1 = require("../models/quiz.model");
const studySession_service_1 = require("./studySession.service");
class QuizService {
    static async submit(userId, subject, score) {
        const quiz = await quiz_model_1.Quiz.create({ user: userId, subject, score });
        await studySession_service_1.StudySessionService.logActivity(userId, 3);
        return quiz;
    }
    static async getAverage(userId) {
        const all = await quiz_model_1.Quiz.find({ user: userId });
        if (all.length === 0)
            return { avgScore: 0, deltaLabel: 'No quizzes yet' };
        const avgScore = Math.round(all.reduce((sum, q) => sum + q.score, 0) / all.length);
        const now = Date.now();
        const last30 = all.filter((q) => now - new Date(q.createdAt).getTime() <= 30 * 86400000);
        const prev30 = all.filter((q) => {
            const age = now - new Date(q.createdAt).getTime();
            return age > 30 * 86400000 && age <= 60 * 86400000;
        });
        let deltaLabel = 'Not enough history yet';
        if (last30.length && prev30.length) {
            const avgLast = last30.reduce((s, q) => s + q.score, 0) / last30.length;
            const avgPrev = prev30.reduce((s, q) => s + q.score, 0) / prev30.length;
            const diff = Math.round(avgLast - avgPrev);
            deltaLabel = `${diff >= 0 ? '+' : ''}${diff}% from last month`;
        }
        return { avgScore, deltaLabel };
    }
    static async getBySubject(userId) {
        const all = await quiz_model_1.Quiz.find({ user: userId });
        const bySubject = new Map();
        for (const q of all) {
            const list = bySubject.get(q.subject) ?? [];
            list.push(q.score);
            bySubject.set(q.subject, list);
        }
        return Array.from(bySubject.entries())
            .map(([subject, scores]) => ({
            subject: subject.length > 12 ? subject.slice(0, 12) + '…' : subject,
            score: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
        }))
            .slice(0, 6);
    }
    static async getLowestSubject(userId) {
        const bySubject = await QuizService.getBySubject(userId);
        if (bySubject.length === 0)
            return null;
        return bySubject.reduce((lowest, cur) => (cur.score < lowest.score ? cur : lowest));
    }
}
exports.QuizService = QuizService;
