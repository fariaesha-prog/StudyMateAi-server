"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlanService = void 0;
const studyPlan_model_1 = require("../models/studyPlan.model");
const plannerGemini_service_1 = require("./plannerGemini.service");
const appError_1 = require("../utils/appError");
function toDateOnly(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
class StudyPlanService {
    static async generate(userId, examName, examDateStr, topics) {
        const today = toDateOnly(new Date());
        const examDate = toDateOnly(new Date(examDateStr));
        const totalDays = Math.round((examDate.getTime() - today.getTime()) / 86400000);
        if (totalDays < 1) {
            throw new appError_1.AppError('Exam date must be at least 1 day in the future', 400);
        }
        if (totalDays > 60) {
            throw new appError_1.AppError('Study plans support a maximum of 60 days', 400);
        }
        const result = await plannerGemini_service_1.PlannerGeminiService.generatePlan(examName, topics, totalDays);
        const days = result.days
            .sort((a, b) => a.dayOffset - b.dayOffset)
            .map((d) => ({
            dayOffset: d.dayOffset,
            date: new Date(today.getTime() + d.dayOffset * 86400000),
            focusTopics: d.focusTopics,
            tasks: d.tasks,
            estimatedHours: d.estimatedHours,
            completed: false,
        }));
        return studyPlan_model_1.StudyPlan.create({
            user: userId,
            examName,
            examDate,
            topics,
            days,
            tips: result.tips,
        });
    }
    static async list(userId) {
        return studyPlan_model_1.StudyPlan.find({ user: userId }).sort({ createdAt: -1 });
    }
    static async getById(id, userId) {
        const plan = await studyPlan_model_1.StudyPlan.findById(id);
        if (!plan)
            throw new appError_1.AppError('Study plan not found', 404);
        if (plan.user.toString() !== userId)
            throw new appError_1.AppError('Not authorized', 403);
        return plan;
    }
    static async toggleDay(id, userId, dayOffset, completed) {
        const plan = await StudyPlanService.getById(id, userId);
        const day = plan.days.find((d) => d.dayOffset === dayOffset);
        if (!day)
            throw new appError_1.AppError('Day not found in this plan', 404);
        day.completed = completed;
        await plan.save();
        return plan;
    }
    static async remove(id, userId) {
        const plan = await StudyPlanService.getById(id, userId);
        await plan.deleteOne();
    }
}
exports.StudyPlanService = StudyPlanService;
