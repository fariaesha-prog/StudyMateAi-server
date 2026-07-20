"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env = {
    PORT: Number(process.env.PORT ?? 5000),
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    MONGO_URI: process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/studymate',
    JWT_SECRET: process.env.JWT_SECRET ?? 'development-secret',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',
};
exports.default = env;
