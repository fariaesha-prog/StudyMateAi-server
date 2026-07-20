"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyDocument = void 0;
const mongoose_1 = require("mongoose");
const keyConceptSchema = new mongoose_1.Schema({ title: { type: String, required: true }, explanation: { type: String, required: true } }, { _id: false });
const flashcardSchema = new mongoose_1.Schema({ question: { type: String, required: true }, answer: { type: String, required: true } }, { _id: false });
const quizQuestionSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
    explanation: { type: String, required: true },
}, { _id: false });
const studyDocumentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true },
    mimeType: { type: String, required: true },
    extractedText: { type: String, required: true },
    summary: { type: String, default: '' },
    concepts: { type: [keyConceptSchema], default: [] },
    importantTopics: { type: [String], default: [] },
    flashcards: { type: [flashcardSchema], default: [] },
    quiz: { type: [quizQuestionSchema], default: [] },
    revisionTips: { type: [String], default: [] },
    status: { type: String, enum: ['processing', 'ready', 'failed'], default: 'processing' },
    errorMessage: { type: String },
}, { timestamps: true });
exports.StudyDocument = (0, mongoose_1.model)('StudyDocument', studyDocumentSchema);
