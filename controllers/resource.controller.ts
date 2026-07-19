import { Request, Response, NextFunction } from 'express';
import { ResourceService } from '../services/resource.service';
import { AppError } from '../utils/appError';

export class ResourceController {
  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      const fileUrl = `/uploads/resources/${req.file.filename}`;
      // Rough page estimate placeholder — real page counts need a PDF/DOCX parser (later).
      const pages = 0;

      const resource = await ResourceService.create(
        req.user!.id,
        req.body,
        fileUrl,
        pages
      );

      res.status(201).json({ status: 'success', data: { resource } });
    } catch (error) {
      next(error);
    }
  }

  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ResourceService.list(req.query as any, req.user?.id);
      res.status(200).json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resource = await ResourceService.getById(req.params.id);
      res.status(200).json({ status: 'success', data: { resource } });
    } catch (error) {
      next(error);
    }
  }

  public static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ResourceService.delete(req.params.id, req.user!.id);
      res.status(200).json({ status: 'success', message: 'Resource deleted' });
    } catch (error) {
      next(error);
    }
  }
}