"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
class UserController {
    static async getMyProfile(req, res, next) {
        try {
            const user = await user_service_1.UserService.getProfile(req.user.id);
            res.status(200).json({ status: 'success', data: { user } });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateMyProfile(req, res, next) {
        try {
            const user = await user_service_1.UserService.updateProfile(req.user.id, req.body);
            res.status(200).json({ status: 'success', data: { user } });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMyStats(req, res, next) {
        try {
            const stats = await user_service_1.UserService.getStats(req.user.id);
            res.status(200).json({ status: 'success', data: stats });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
