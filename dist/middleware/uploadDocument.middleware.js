"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = void 0;
const multer_1 = __importDefault(require("multer"));
const appError_1 = require("../utils/appError");
const storage = multer_1.default.memoryStorage();
const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'text/plain',
];
exports.uploadDocument = (0, multer_1.default)({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
            return cb(new appError_1.AppError('Unsupported file type. Allowed: PDF, DOCX, TXT.', 400));
        }
        cb(null, true);
    },
});
