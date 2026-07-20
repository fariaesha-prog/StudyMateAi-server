"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const mongoose_1 = require("mongoose");
const quizSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    resource: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Resource' },
    subject: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
}, { timestamps: true });
exports.Quiz = (0, mongoose_1.model)('Quiz', quizSchema);
