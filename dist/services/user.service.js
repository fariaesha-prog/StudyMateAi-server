"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("../models/user.model");
const resource_model_1 = require("../models/resource.model");
const quiz_model_1 = require("../models/quiz.model");
const studySession_model_1 = require("../models/studySession.model");
const appError_1 = require("../utils/appError");
class UserService {
    static async getProfile(userId) {
        const user = await user_model_1.User.findById(userId);
        if (!user)
            throw new appError_1.AppError('User not found', 404);
        return user;
    }
    static async updateProfile(userId, input) {
        const user = await user_model_1.User.findByIdAndUpdate(userId, input, {
            new: true,
            runValidators: true,
        });
        if (!user)
            throw new appError_1.AppError('User not found', 404);
        return user;
    }
    static async getStats(userId) {
        const [resourcesCount, studySessions, quizzes, recentUploads] = await Promise.all([
            resource_model_1.Resource.countDocuments({ user: userId }),
            studySession_model_1.StudySession.find({ user: userId }).sort({ date: -1 }),
            quiz_model_1.Quiz.find({ user: userId }),
            resource_model_1.Resource.find({ user: userId }).sort({ createdAt: -1 }).limit(4),
        ]);
        const totalMinutes = studySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
        const studyHours = Math.round(totalMinutes / 60);
        const quizAvg = quizzes.length
            ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length)
            : 0;
        // Streak: consecutive days (including today) with at least one session
        let streak = 0;
        const daySet = new Set(studySessions.map((s) => s.date.toISOString().slice(0, 10)));
        const cursor = new Date();
        while (true) {
            const key = cursor.toISOString().slice(0, 10);
            if (daySet.has(key)) {
                streak++;
                cursor.setDate(cursor.getDate() - 1);
            }
            else {
                break;
            }
        }
        // Monthly activity — last 6 months, summed hours
        const now = new Date();
        const monthlyActivity = [];
        for (let i = 5; i >= 0; i--) {
            const target = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthLabel = target.toLocaleString('en-US', { month: 'short' });
            const minutesInMonth = studySessions
                .filter((s) => s.date.getFullYear() === target.getFullYear() &&
                s.date.getMonth() === target.getMonth())
                .reduce((sum, s) => sum + s.durationMinutes, 0);
            monthlyActivity.push({ month: monthLabel, hours: Math.round(minutesInMonth / 60) });
        }
        return {
            resourcesCount,
            studyHours,
            quizAvg,
            streak,
            monthlyActivity,
            recentUploads,
            totalAiChats: 0, // placeholder until AI Chat backend exists
        };
    }
}
exports.UserService = UserService;
