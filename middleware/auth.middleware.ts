import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AppError } from '../utils/appError';

interface DecodedToken {
  id: string;
  email: string;
}

/**
 * Route protection middleware to guard private endpoints.
 * Validates the secure HttpOnly JWT cookie and attaches the user context to the request.
 */
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Extract the token explicitly from the HttpOnly cookie storage container
    const token = req.cookies?.token;

    if (!token || token === 'loggedout') {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // 2. Cryptographically verify the token integrity
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as DecodedToken;

    // 3. Ensure the target account wasn't deleted mid-session
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4. Attach the authenticated context properties to the core Express Request interface
    req.user = {
      id: currentUser._id.toString(),
      email: currentUser.email,
    };

    next();
  } catch (error) {
    // Catch expiring verification steps or forged payloads cleanly and enforce a 401 response
    return next(new AppError('Invalid token or token session has expired.', 401));
  }
};