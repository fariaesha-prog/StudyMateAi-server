import { Request, Response, NextFunction } from 'express';
import { AuthService, generateAndSendToken } from '../services/auth.service';
import { User } from '../models/user.model';
import { AppError } from '../utils/appError';

export class AuthController {
  /**
   * Standard Registration Controller
   */
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newUser = await AuthService.register(req.body);
      generateAndSendToken(newUser, 201, res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Standard Credentials Login Controller
   */
  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await AuthService.login(req.body);
      generateAndSendToken(user, 200, res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Google OAuth Authentication Controller
   */
  public static async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { idToken } = req.body;
      
      // 1. Verify token validation with Google APIs
      const googlePayload = await AuthService.verifyGoogleToken(idToken);
      
      // 2. Process account matching or auto-provisioning
      const user = await AuthService.handleGoogleUser(googlePayload);
      
      // 3. Issue the exact same standard HttpOnly JWT cookie
      generateAndSendToken(user, 200, res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Auto-provisioned Demo Account Login Controller
   */
  public static async demoAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Fetch or automatically provision the system demo user
      const user = await AuthService.handleDemoUser();
      
      // 2. Issue the exact same secure HttpOnly JWT cookie used by regular sign-ins
      generateAndSendToken(user, 200, res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Authentication Session Revocation (Logout) Controller
   */
  public static async logout(req: Request, res: Response): Promise<void> {
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
  public static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // req.user context is populated safely upstream by the 'protect' middleware layer
      const currentUser = await User.findById(req.user?.id);
      if (!currentUser) {
        return next(new AppError('User belonging to this token no longer exists.', 404));
      }
      res.status(200).json({
        status: 'success',
        data: { user: currentUser },
      });
    } catch (error) {
      next(error);
    }
  }
}