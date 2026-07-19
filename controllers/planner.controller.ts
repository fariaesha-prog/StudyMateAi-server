import { Request, Response, NextFunction } from 'express';
import { StudyPlanService } from '../services/studyPlan.service';
import { AppError } from '../utils/appError';

export class PlannerController {
  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { examName, examDate, topics } = req.body;
      if (!examName || !examDate || !Array.isArray(topics) || topics.length === 0) {
        throw new AppError('examName, examDate, and at least one topic are required', 400);
      }
      const plan = await StudyPlanService.generate(req.user!.id, examName, examDate, topics);
      res.status(201).json({ status: 'success', data: { plan } });
    } catch (error) {
      next(error);
    }
  }

  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plans = await StudyPlanService.list(req.user!.id);
      res.status(200).json({ status: 'success', data: { plans } });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plan = await StudyPlanService.getById(req.params.id, req.user!.id);
      res.status(200).json({ status: 'success', data: { plan } });
    } catch (error) {
      next(error);
    }
  }

  public static async toggleDay(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plan = await StudyPlanService.toggleDay(
        req.params.id,
        req.user!.id,
        Number(req.params.dayOffset),
        req.body.completed
      );
      res.status(200).json({ status: 'success', data: { plan } });
    } catch (error) {
      next(error);
    }
  }

  public static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await StudyPlanService.remove(req.params.id, req.user!.id);
      res.status(200).json({ status: 'success', message: 'Study plan deleted' });
    } catch (error) {
      next(error);
    }
  }
}