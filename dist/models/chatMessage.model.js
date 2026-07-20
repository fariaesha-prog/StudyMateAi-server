"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
const mongoose_1 = require("mongoose");
const chatMessageSchema = new mongoose_1.Schema({
    session: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ChatSession', required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    message: { type: String, required: true },
}, { timestamps: true });
exports.ChatMessage = (0, mongoose_1.model)('ChatMessage', chatMessageSchema);
