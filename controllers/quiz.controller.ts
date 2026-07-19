import { Request, Response, NextFunction } from 'express';
import { QuizService } from '../services/quiz.service';
import { AppError } from '../utils/appError';

export class QuizController {
  public static async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subject, score } = req.body;
      if (!subject || typeof score !== 'number') {
        throw new AppError('subject and score are required', 400);
      }
      const quiz = await QuizService.submit(req.user!.id, subject, score);
      res.status(201).json({ status: 'success', data: { quiz } });
    } catch (error) {
      next(error);
    }
  }
}