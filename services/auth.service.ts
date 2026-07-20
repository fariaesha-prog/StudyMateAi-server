import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/user.model';
import { AppError } from '../utils/appError';
import { RegisterInput, LoginInput } from '../types/user.interface';

// Initialize the Google Auth Client using the Environment Variable
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Utility helper to sign a JWT token and set it inside an HttpOnly cookie.
 * Reused consistently across standard credentials login, registration, Google auth, and Demo access.
 */
export const generateAndSendToken = (user: any, statusCode: number, res: Response) => {
 const token = jwt.sign(
  { id: user._id, email: user.email },
  process.env.JWT_SECRET || 'fallback_secret',
  { expiresIn: process.env.JWT_EXPIRES_IN || '1d' } as jwt.SignOptions
);

const cookieOptions = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
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

export class AuthService {
  /**
   * Standard Email & Password Registration
   */
  public static async register(input: RegisterInput) {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }
    return await User.create(input);
  }

  /**
   * Standard Email & Password Login
   */
  public static async login(input: LoginInput) {
    const user = await User.findOne({ email: input.email }).select('+password');
    if (!user || !(await user.comparePassword(input.password))) {
      throw new AppError('Incorrect email or password', 401);
    }
    return user;
  }

  /**
   * Verifies Google Identity Services ID Token integrity via Google's library APIs
   */
  public static async verifyGoogleToken(idToken: string) {
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new AppError('Invalid Google token payload', 400);
      }

      return {
        email: payload.email,
        fullName: payload.name || 'Google User',
        profilePicture: payload.picture || '',
        emailVerified: payload.email_verified,
      };
    } catch (error) {
      throw new AppError('Google authentication failed verification', 401);
    }
  }

  /**
   * Automatically signs in a verified Google user or signs them up if missing
   */
  public static async handleGoogleUser(googleUser: {
    email: string;
    fullName: string;
    profilePicture: string;
    emailVerified?: boolean;
  }) {
    if (!googleUser.emailVerified) {
      throw new AppError('Google account email is not verified', 400);
    }

    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // Generate a strong random placeholder password for account creation integrity
      const randomPassword = Math.random().toString(36).slice(-16) + 'A1!';
      
      user = await User.create({
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
  public static async handleDemoUser() {
    const DEMO_EMAIL = 'demo@lumio.ai';
    const DEMO_PASSWORD = 'demo12345';
    const DEMO_NAME = 'Demo Account';

    let user = await User.findOne({ email: DEMO_EMAIL });

    if (!user) {
      // Create the core system demo account automatically on first click
      user = await User.create({
        fullName: DEMO_NAME,
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        profilePicture: '',
      });
    }

    return user;
  }
}