"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
class DashboardController {
    static async getSummary(req, res, next) {
        try {
            const summary = await dashboard_service_1.DashboardService.getSummary(req.user.id);
            res.status(200).json({ status: 'success', data: summary });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DashboardController = DashboardController;
