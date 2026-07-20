"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlannerController = void 0;
const studyPlan_service_1 = require("../services/studyPlan.service");
const appError_1 = require("../utils/appError");
class PlannerController {
    static async create(req, res, next) {
        try {
            const { examName, examDate, topics } = req.body;
            if (!examName || !examDate || !Array.isArray(topics) || topics.length === 0) {
                throw new appError_1.AppError('examName, examDate, and at least one topic are required', 400);
            }
            const plan = await studyPlan_service_1.StudyPlanService.generate(req.user.id, examName, examDate, topics);
            res.status(201).json({ status: 'success', data: { plan } });
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const plans = await studyPlan_service_1.StudyPlanService.list(req.user.id);
            res.status(200).json({ status: 'success', data: { plans } });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const plan = await studyPlan_service_1.StudyPlanService.getById(req.params.id, req.user.id);
            res.status(200).json({ status: 'success', data: { plan } });
        }
        catch (error) {
            next(error);
        }
    }
    static async toggleDay(req, res, next) {
        try {
            const plan = await studyPlan_service_1.StudyPlanService.toggleDay(req.params.id, req.user.id, Number(req.params.dayOffset), req.body.completed);
            res.status(200).json({ status: 'success', data: { plan } });
        }
        catch (error) {
            next(error);
        }
    }
    static async remove(req, res, next) {
        try {
            await studyPlan_service_1.StudyPlanService.remove(req.params.id, req.user.id);
            res.status(200).json({ status: 'success', message: 'Study plan deleted' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PlannerController = PlannerController;
