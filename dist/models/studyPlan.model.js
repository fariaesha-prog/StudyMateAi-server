"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlan = void 0;
const mongoose_1 = require("mongoose");
const planDaySchema = new mongoose_1.Schema({
    dayOffset: { type: Number, required: true },
    date: { type: Date, required: true },
    focusTopics: { type: [String], default: [] },
    tasks: { type: [String], default: [] },
    estimatedHours: { type: Number, default: 1 },
    completed: { type: Boolean, default: false },
}, { _id: false });
const studyPlanSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    examName: { type: String, required: true, trim: true },
    examDate: { type: Date, required: true },
    topics: { type: [String], required: true },
    days: { type: [planDaySchema], default: [] },
    tips: { type: [String], default: [] },
}, { timestamps: true });
exports.StudyPlan = (0, mongoose_1.model)('StudyPlan', studyPlanSchema);
