"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const resource_model_1 = require("../models/resource.model");
const chatMessage_model_1 = require("../models/chatMessage.model");
const chatSession_model_1 = require("../models/chatSession.model");
const studyDocument_model_1 = require("../models/studyDocument.model");
const studySession_service_1 = require("./studySession.service");
const quiz_service_1 = require("./quiz.service");
const COVER_PALETTE = [
    'from-indigo-500/30 to-indigo-900/30',
    'from-cyan-500/30 to-cyan-900/30',
    'from-emerald-500/30 to-emerald-900/30',
    'from-amber-500/30 to-amber-900/30',
    'from-purple-500/30 to-purple-900/30',
];
function pickCoverColor(seed) {
    const hash = seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return COVER_PALETTE[hash % COVER_PALETTE.length];
}
class DashboardService {
    static async getSummary(userId) {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const startOfWeek = new Date(Date.now() - ((new Date().getDay() + 6) % 7) * 86400000);
        startOfWeek.setHours(0, 0, 0, 0);
        const [resourcesCount, resourcesThisMonth, aiConversations, aiConversationsThisWeek, streak, weeklyChart, quizAvg, quizBySubject, recentResources, processingDocs, readyDocs, lowestSubject, latestSession,] = await Promise.all([
            resource_model_1.Resource.countDocuments({ user: userId }),
            resource_model_1.Resource.countDocuments({ user: userId, createdAt: { $gte: startOfMonth } }),
            chatMessage_model_1.ChatMessage.countDocuments({ user: userId }),
            chatMessage_model_1.ChatMessage.countDocuments({ user: userId, createdAt: { $gte: startOfWeek } }),
            studySession_service_1.StudySessionService.getStreak(userId),
            studySession_service_1.StudySessionService.getWeeklyChart(userId),
            quiz_service_1.QuizService.getAverage(userId),
            quiz_service_1.QuizService.getBySubject(userId),
            resource_model_1.Resource.find({ user: userId }).sort({ createdAt: -1 }).limit(4),
            studyDocument_model_1.StudyDocument.countDocuments({ user: userId, status: 'processing' }),
            studyDocument_model_1.StudyDocument.find({ user: userId, status: 'ready' }).sort({ createdAt: -1 }).limit(1),
            quiz_service_1.QuizService.getLowestSubject(userId),
            chatSession_model_1.ChatSession.findOne({ user: userId }).sort({ updatedAt: -1 }),
        ]);
        const recommendations = [];
        if (lowestSubject) {
            recommendations.push({
                id: 'r-weak-subject',
                title: `Review weak areas in ${lowestSubject.subject}`,
                description: `Average quiz score is ${lowestSubject.score}%`,
                icon: 'trend',
            });
        }
        if (processingDocs > 0) {
            recommendations.push({
                id: 'r-processing',
                title: 'A document is still being analyzed',
                description: 'Check back soon for your generated study material',
                icon: 'flashcard',
            });
        }
        else if (readyDocs.length > 0) {
            recommendations.push({
                id: 'r-ready-doc',
                title: `Practice flashcards from "${readyDocs[0].title}"`,
                description: 'Ready to review',
                icon: 'flashcard',
            });
        }
        if (latestSession && recommendations.length < 3) {
            recommendations.push({
                id: 'r-continue-chat',
                title: `Continue chat: ${latestSession.title}`,
                description: 'Pick up where you left off',
                icon: 'chat',
            });
        }
        if (recommendations.length === 0) {
            recommendations.push({
                id: 'r-empty',
                title: 'Upload your first document',
                description: 'Get an AI-generated summary, flashcards, and quiz',
                icon: 'flashcard',
            });
        }
        return {
            reviewCount: readyDocs.length > 0 ? await studyDocument_model_1.StudyDocument.countDocuments({ user: userId, status: 'ready' }) : 0,
            stats: {
                studyStreak: streak.current,
                studyStreakDelta: streak.deltaLabel,
                resourcesCount,
                resourcesDelta: `${resourcesThisMonth} added this month`,
                avgQuizScore: quizAvg.avgScore,
                quizScoreDelta: quizAvg.deltaLabel,
                aiConversations,
                aiConversationsDelta: `${aiConversationsThisWeek} this week`,
            },
            studyTime: weeklyChart.data,
            studyTimeWeekDeltaLabel: weeklyChart.weekDeltaLabel,
            quizScores: quizBySubject,
            recentUploads: recentResources.map((r) => ({
                id: r._id.toString(),
                title: r.title,
                subject: r.subject,
                date: new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                status: r.status,
                coverColor: pickCoverColor(r.subject),
            })),
            recommendations: recommendations.slice(0, 3),
        };
    }
}
exports.DashboardService = DashboardService;
