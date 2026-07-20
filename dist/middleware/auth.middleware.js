"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const appError_1 = require("../utils/appError");
/**
 * Route protection middleware to guard private endpoints.
 * Validates the secure HttpOnly JWT cookie and attaches the user context to the request.
 */
const protect = async (req, res, next) => {
    try {
        // 1. Extract the token explicitly from the HttpOnly cookie storage container
        const token = req.cookies?.token;
        if (!token || token === 'loggedout') {
            return next(new appError_1.AppError('You are not logged in. Please log in to get access.', 401));
        }
        // 2. Cryptographically verify the token integrity
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        // 3. Ensure the target account wasn't deleted mid-session
        const currentUser = await user_model_1.User.findById(decoded.id);
        if (!currentUser) {
            return next(new appError_1.AppError('The user belonging to this token no longer exists.', 401));
        }
        // 4. Attach the authenticated context properties to the core Express Request interface
        req.user = {
            id: currentUser._id.toString(),
            email: currentUser.email,
        };
        next();
    }
    catch (error) {
        // Catch expiring verification steps or forged payloads cleanly and enforce a 401 response
        return next(new appError_1.AppError('Invalid token or token session has expired.', 401));
    }
};
exports.protect = protect;
