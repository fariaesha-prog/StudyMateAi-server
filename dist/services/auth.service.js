"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.generateAndSendToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const user_model_1 = require("../models/user.model");
const appError_1 = require("../utils/appError");
// Initialize the Google Auth Client using the Environment Variable
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
/**
 * Utility helper to sign a JWT token and set it inside an HttpOnly cookie.
 * Reused consistently across standard credentials login, registration, Google auth, and Demo access.
 */
const generateAndSendToken = (user, statusCode, res) => {
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 Day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };
    res.cookie('token', token, cookieOptions);
    res.status(statusCode).json({
        status: 'success',
        data: {
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePicture: user.profilePicture || '',
            },
        },
    });
};
exports.generateAndSendToken = generateAndSendToken;
class AuthService {
    /**
     * Standard Email & Password Registration
     */
    static async register(input) {
        const existingUser = await user_model_1.User.findOne({ email: input.email });
        if (existingUser) {
            throw new appError_1.AppError('Email already registered', 400);
        }
        return await user_model_1.User.create(input);
    }
    /**
     * Standard Email & Password Login
     */
    static async login(input) {
        const user = await user_model_1.User.findOne({ email: input.email }).select('+password');
        if (!user || !(await user.comparePassword(input.password))) {
            throw new appError_1.AppError('Incorrect email or password', 401);
        }
        return user;
    }
    /**
     * Verifies Google Identity Services ID Token integrity via Google's library APIs
     */
    static async verifyGoogleToken(idToken) {
        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw new appError_1.AppError('Invalid Google token payload', 400);
            }
            return {
                email: payload.email,
                fullName: payload.name || 'Google User',
                profilePicture: payload.picture || '',
                emailVerified: payload.email_verified,
            };
        }
        catch (error) {
            throw new appError_1.AppError('Google authentication failed verification', 401);
        }
    }
    /**
     * Automatically signs in a verified Google user or signs them up if missing
     */
    static async handleGoogleUser(googleUser) {
        if (!googleUser.emailVerified) {
            throw new appError_1.AppError('Google account email is not verified', 400);
        }
        let user = await user_model_1.User.findOne({ email: googleUser.email });
        if (!user) {
            // Generate a strong random placeholder password for account creation integrity
            const randomPassword = Math.random().toString(36).slice(-16) + 'A1!';
            user = await user_model_1.User.create({
                fullName: googleUser.fullName,
                email: googleUser.email,
                password: randomPassword,
                profilePicture: googleUser.profilePicture,
            });
        }
        return user;
    }
    /**
     * Automatic tracking and management lifecycle for the shared platform Demo account
     */
    static async handleDemoUser() {
        const DEMO_EMAIL = 'demo@lumio.ai';
        const DEMO_PASSWORD = 'demo12345';
        const DEMO_NAME = 'Demo Account';
        let user = await user_model_1.User.findOne({ email: DEMO_EMAIL });
        if (!user) {
            // Create the core system demo account automatically on first click
            user = await user_model_1.User.create({
                fullName: DEMO_NAME,
                email: DEMO_EMAIL,
                password: DEMO_PASSWORD,
                profilePicture: '',
            });
        }
        return user;
    }
}
exports.AuthService = AuthService;
