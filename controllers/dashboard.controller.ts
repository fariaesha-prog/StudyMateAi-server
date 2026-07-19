import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  public static async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await DashboardService.getSummary(req.user!.id);
      res.status(200).json({ status: 'success', data: summary });
    } catch (error) {
      next(error);
    }
  }
}