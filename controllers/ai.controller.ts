import { Request, Response, NextFunction } from 'express';
import { StudyDocumentService } from '../services/studyDocument.service';
import { AppError } from '../utils/appError';

export class AiController {
  public static async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      const doc = await StudyDocumentService.createFromUpload(req.user!.id, req.file, req.body.title);

      res.status(201).json({
        status: 'success',
        data: {
          documentId: doc._id,
          title: doc.title,
          summary: doc.summary,
          concepts: doc.concepts,
          importantTopics: doc.importantTopics,
          flashcards: doc.flashcards,
          quiz: doc.quiz,
          revisionTips: doc.revisionTips,
          status: doc.status,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doc = await StudyDocumentService.getById(req.params.id as string, req.user!.id);
      res.status(200).json({ status: 'success', data: { document: doc } });
    } catch (error) {
      next(error);
    }
  }
}