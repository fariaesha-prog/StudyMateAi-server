"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImgbbService = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const appError_1 = require("../utils/appError");
class ImgbbService {
    static async uploadImage(fileBuffer, fileName) {
        const apiKey = process.env.IMGBB_API_KEY;
        if (!apiKey) {
            throw new appError_1.AppError('Image upload service is not configured', 500);
        }
        const form = new form_data_1.default();
        form.append('image', fileBuffer.toString('base64'));
        form.append('name', fileName);
        try {
            const response = await axios_1.default.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, form, { headers: form.getHeaders() });
            const imageUrl = response.data?.data?.url;
            if (!imageUrl) {
                throw new appError_1.AppError('ImgBB did not return an image URL', 502);
            }
            return imageUrl;
        }
        catch (error) {
            throw new appError_1.AppError('Failed to upload image to ImgBB', 502);
        }
    }
}
exports.ImgbbService = ImgbbService;
