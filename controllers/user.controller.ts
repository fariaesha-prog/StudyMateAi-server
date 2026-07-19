import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  public static async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.getProfile(req.user!.id);
      res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
      next(error);
    }
  }

  public static async updateMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.updateProfile(req.user!.id, req.body);
      res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
      next(error);
    }
  }

  public static async getMyStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await UserService.getStats(req.user!.id);
      res.status(200).json({ status: 'success', data: stats });
    } catch (error) {
      next(error);
    }
  }
}