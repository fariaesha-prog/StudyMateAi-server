"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = __importDefault(require("@/config/environment"));
const connectDatabase = async () => {
    if (!environment_1.default.MONGO_URI) {
        throw new Error('MONGO_URI is not defined');
    }
    await mongoose_1.default.connect(environment_1.default.MONGO_URI);
};
exports.connectDatabase = connectDatabase;
