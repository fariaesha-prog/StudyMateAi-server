"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const user_model_1 = require("../models/user.model");
const appError_1 = require("../utils/appError");
class AuthController {
    /**
     * Standard Registration Controller
     */
    static async register(req, res, next) {
        try {
            const newUser = await auth_service_1.AuthService.register(req.body);
            (0, auth_service_1.generateAndSendToken)(newUser, 201, res);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Standard Credentials Login Controller
     */
    static async login(req, res, next) {
        try {
            const user = await auth_service_1.AuthService.login(req.body);
            (0, auth_service_1.generateAndSendToken)(user, 200, res);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Google OAuth Authentication Controller
     */
    static async googleAuth(req, res, next) {
        try {
            const { idToken } = req.body;
            // 1. Verify token validation with Google APIs
            const googlePayload = await auth_service_1.AuthService.verifyGoogleToken(idToken);
            // 2. Process account matching or auto-provisioning
            const user = await auth_service_1.AuthService.handleGoogleUser(googlePayload);
            // 3. Issue the exact same standard HttpOnly JWT cookie
            (0, auth_service_1.generateAndSendToken)(user, 200, res);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Auto-provisioned Demo Account Login Controller
     */
    static async demoAuth(req, res, next) {
        try {
            // 1. Fetch or automatically provision the system demo user
            const user = await auth_service_1.AuthService.handleDemoUser();
            // 2. Issue the exact same secure HttpOnly JWT cookie used by regular sign-ins
            (0, auth_service_1.generateAndSendToken)(user, 200, res);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Authentication Session Revocation (Logout) Controller
     */
    static async logout(req, res) {
        res.cookie('token', 'loggedout', {
            expires: new Date(Date.now() + 10 * 1000), // Clears instantly (10 seconds fallback buffer)
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    }
    /**
     * Hydrate Authenticated Client State (/auth/me) Controller
     */
    static async getMe(req, res, next) {
        try {
            // req.user context is populated safely upstream by the 'protect' middleware layer
            const currentUser = await user_model_1.User.findById(req.user?.id);
            if (!currentUser) {
                return next(new appError_1.AppError('User belonging to this token no longer exists.', 404));
            }
            res.status(200).json({
                status: 'success',
                data: { user: currentUser },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
