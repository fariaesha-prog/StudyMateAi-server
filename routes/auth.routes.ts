import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { protect } from '../middleware/auth.middleware';
import { registerSchema, loginSchema, googleAuthSchema } from '../validators/auth.validator';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new platform account with email & password
 * @access  Public
 */
router.post('/register', validate(registerSchema), AuthController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate credentials using email & password
 * @access  Public
 */
router.post('/login', validate(loginSchema), AuthController.login);

/**
 * @route   POST /api/v1/auth/google
 * @desc    Sign in or auto-provision via Google Identity Services ID token
 * @access  Public
 */
router.post('/google', validate(googleAuthSchema), AuthController.googleAuth);

/**
 * @route   POST /api/v1/auth/demo
 * @desc    Instant one-click access using the shared system demo user account
 * @access  Public
 */
router.post('/demo', AuthController.demoAuth);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Revoke authorization session by instantly wiping the HttpOnly cookie
 * @access  Public
 */
router.post('/logout', AuthController.logout);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Retrieve core user profile data for current authenticated session
 * @access  Private (Protected via verification middleware)
 */
router.get('/me', protect, AuthController.getMe);

export default router;