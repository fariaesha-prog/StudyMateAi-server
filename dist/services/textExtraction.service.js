"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextExtractionService = void 0;
const pdf_parse_1 = require("pdf-parse");
const mammoth_1 = __importDefault(require("mammoth"));
const appError_1 = require("../utils/appError");
class TextExtractionService {
    static async extract(buffer, mimeType) {
        let text = '';
        if (mimeType === 'application/pdf') {
            const parser = new pdf_parse_1.PDFParse({ data: buffer });
            try {
                const result = await parser.getText();
                text = result.text;
            }
            finally {
                await parser.destroy();
            }
        }
        else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth_1.default.extractRawText({ buffer });
            text = result.value;
        }
        else if (mimeType === 'text/plain') {
            text = buffer.toString('utf-8');
        }
        else {
            throw new appError_1.AppError('Unsupported file type for text extraction', 400);
        }
        const cleaned = text.trim();
        if (!cleaned) {
            throw new appError_1.AppError('No readable text found in the uploaded file', 422);
        }
        return cleaned;
    }
}
exports.TextExtractionService = TextExtractionService;
