import { Request, Response, NextFunction } from 'express';
import { ImgbbService } from '../services/imgbb.service';
import { AppError } from '../utils/appError';

export class UploadController {
  public static async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('No image file provided', 400);
      }

      const imageUrl = await ImgbbService.uploadImage(req.file.buffer, req.file.originalname);

      res.status(200).json({
        status: 'success',
        data: { url: imageUrl },
      });
    } catch (error) {
      next(error);
    }
  }
}