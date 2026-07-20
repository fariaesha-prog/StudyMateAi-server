"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceController = void 0;
const resource_service_1 = require("../services/resource.service");
const appError_1 = require("../utils/appError");
class ResourceController {
    static async create(req, res, next) {
        try {
            if (!req.file) {
                throw new appError_1.AppError('No file uploaded', 400);
            }
            const fileUrl = `/uploads/resources/${req.file.filename}`;
            // Rough page estimate placeholder — real page counts need a PDF/DOCX parser (later).
            const pages = 0;
            const resource = await resource_service_1.ResourceService.create(req.user.id, req.body, fileUrl, pages);
            res.status(201).json({ status: 'success', data: { resource } });
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const result = await resource_service_1.ResourceService.list(req.query, req.user?.id);
            res.status(200).json({ status: 'success', ...result });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const resource = await resource_service_1.ResourceService.getById(req.params.id);
            res.status(200).json({ status: 'success', data: { resource } });
        }
        catch (error) {
            next(error);
        }
    }
    static async remove(req, res, next) {
        try {
            await resource_service_1.ResourceService.delete(req.params.id, req.user.id);
            res.status(200).json({ status: 'success', message: 'Resource deleted' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ResourceController = ResourceController;
