"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const imgbb_service_1 = require("../services/imgbb.service");
const appError_1 = require("../utils/appError");
class UploadController {
    static async uploadImage(req, res, next) {
        try {
            if (!req.file) {
                throw new appError_1.AppError('No image file provided', 400);
            }
            const imageUrl = await imgbb_service_1.ImgbbService.uploadImage(req.file.buffer, req.file.originalname);
            res.status(200).json({
                status: 'success',
                data: { url: imageUrl },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UploadController = UploadController;
