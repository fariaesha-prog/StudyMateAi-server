import path from 'path';
import fs from 'fs/promises';
import { StudyDocument } from '../models/studyDocument.model';
import { TextExtractionService } from './textExtraction.service';
import { GeminiService } from './gemini.service';
import { AppError } from '../utils/appError';
import { StudySessionService } from './studySession.service';
export class StudyDocumentService {
  public static async createFromUpload(userId: string, file: Express.Multer.File, title?: string) {
    const uploadsDir = path.join(__dirname, '..', 'uploads', 'documents');
    await fs.mkdir(uploadsDir, { recursive: true });
    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    await fs.writeFile(path.join(uploadsDir, filename), file.buffer);
    const fileUrl = `/uploads/documents/${filename}`;

    const extractedText = await TextExtractionService.extract(file.buffer, file.mimetype);

    const doc = await StudyDocument.create({
      user: userId,
      title: title?.trim() || file.originalname,
      filename,
      fileUrl,
      mimeType: file.mimetype,
      extractedText,
      status: 'processing',
    });

    try {
      const aiResult = await GeminiService.generateStudyMaterial(extractedText);
      doc.summary = aiResult.summary;
      doc.concepts = aiResult.concepts;
      doc.importantTopics = aiResult.importantTopics;
      doc.flashcards = aiResult.flashcards;
      doc.quiz = aiResult.quiz;
      doc.revisionTips = aiResult.revisionTips;
      doc.status = 'ready';
      await doc.save();
      await StudySessionService.logActivity(userId, 5);
    } catch (error) {
      doc.status = 'failed';
      doc.errorMessage = error instanceof AppError ? error.message : 'AI generation failed';
      await doc.save();
      throw error;
    }

    return doc;
  }

  public static async getById(id: string, userId: string) {
    const doc = await StudyDocument.findById(id);
    if (!doc) throw new AppError('Document not found', 404);
    if (doc.user.toString() !== userId) throw new AppError('Not authorized to view this document', 403);
    return doc;
  }
}