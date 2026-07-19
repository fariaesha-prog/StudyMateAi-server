import { Request, Response, NextFunction } from 'express';
import { ChatSessionService } from '../services/chatSession.service';

export class ChatController {
  public static async listSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessions = await ChatSessionService.listSessions(req.user!.id);
      res.status(200).json({ status: 'success', data: { sessions } });
    } catch (error) {
      next(error);
    }
  }

  public static async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await ChatSessionService.createSession(req.user!.id, req.body.documentId, req.body.title);
      res.status(201).json({ status: 'success', data: { session } });
    } catch (error) {
      next(error);
    }
  }

  public static async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ChatSessionService.getMessages(req.params.sessionId, req.user!.id);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const assistantMessage = await ChatSessionService.sendMessage(
        req.params.sessionId,
        req.user!.id,
        req.body.message
      );
      res.status(200).json({ status: 'success', data: { message: assistantMessage } });
    } catch (error) {
      next(error);
    }
  }

  public static async attachDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await ChatSessionService.attachDocument(req.params.sessionId, req.user!.id, req.body.documentId);
      res.status(200).json({ status: 'success', data: { session } });
    } catch (error) {
      next(error);
    }
  }
}