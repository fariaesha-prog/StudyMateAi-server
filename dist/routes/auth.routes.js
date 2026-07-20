"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new platform account with email & password
 * @access  Public
 */
router.post('/register', (0, validate_middleware_1.validate)(auth_validator_1.registerSchema), auth_controller_1.AuthController.register);
/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate credentials using email & password
 * @access  Public
 */
router.post('/login', (0, validate_middleware_1.validate)(auth_validator_1.loginSchema), auth_controller_1.AuthController.login);
/**
 * @route   POST /api/v1/auth/google
 * @desc    Sign in or auto-provision via Google Identity Services ID token
 * @access  Public
 */
router.post('/google', (0, validate_middleware_1.validate)(auth_validator_1.googleAuthSchema), auth_controller_1.AuthController.googleAuth);
/**
 * @route   POST /api/v1/auth/demo
 * @desc    Instant one-click access using the shared system demo user account
 * @access  Public
 */
router.post('/demo', auth_controller_1.AuthController.demoAuth);
/**
 * @route   POST /api/v1/auth/logout
 * @desc    Revoke authorization session by instantly wiping the HttpOnly cookie
 * @access  Public
 */
router.post('/logout', auth_controller_1.AuthController.logout);
/**
 * @route   GET /api/v1/auth/me
 * @desc    Retrieve core user profile data for current authenticated session
 * @access  Private (Protected via verification middleware)
 */
router.get('/me', auth_middleware_1.protect, auth_controller_1.AuthController.getMe);
exports.default = router;
