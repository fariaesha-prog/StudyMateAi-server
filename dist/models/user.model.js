"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    profilePicture: { type: String, default: '' },
    title: { type: String, default: '' },
    bio: { type: String, default: '' },
    favoriteSubjects: { type: [String], default: [] },
}, { timestamps: true });
userSchema.pre('save', async function () {
    if (!this.isModified('password'))
        return;
    const salt = await bcrypt_1.default.genSalt(10);
    this.password = await bcrypt_1.default.hash(this.password, salt);
});
userSchema.methods.comparePassword = async function (password) {
    return bcrypt_1.default.compare(password, this.password);
};
exports.User = (0, mongoose_1.model)('User', userSchema);
