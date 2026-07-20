"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const mongoose_1 = require("mongoose");
const resourceSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    category: {
        type: String,
        enum: ['Notes', 'Flashcards', 'Quiz', 'Summary', 'Cheat Sheet'],
        required: true,
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner',
    },
    description: { type: String, default: '' },
    fileUrl: { type: String, required: true },
    pages: { type: Number, default: 0 },
    status: { type: String, enum: ['Processing', 'Ready'], default: 'Processing' },
    rating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
}, { timestamps: true });
exports.Resource = (0, mongoose_1.model)('Resource', resourceSchema);
