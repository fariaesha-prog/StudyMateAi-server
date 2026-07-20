"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudySession = void 0;
const mongoose_1 = require("mongoose");
const studySessionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, min: 0 },
}, { timestamps: true });
exports.StudySession = (0, mongoose_1.model)('StudySession', studySessionSchema);
