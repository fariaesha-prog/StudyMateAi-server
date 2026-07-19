import { ChatSession } from '../models/chatSession.model';
import { ChatMessage } from '../models/chatMessage.model';
import { StudyDocument } from '../models/studyDocument.model';
import { ChatGeminiService } from './chatGemini.service';
import { AppError } from '../utils/appError';

export class ChatSessionService {
  public static async listSessions(userId: string) {
    return ChatSession.find({ user: userId }).sort({ updatedAt: -1 });
  }

  public static async createSession(userId: string, documentId?: string, title?: string) {
    let doc = null;
    if (documentId) {
      doc = await StudyDocument.findById(documentId);
      if (!doc) throw new AppError('Document not found', 404);
      if (doc.user.toString() !== userId) throw new AppError('Not authorized to use this document', 403);
    }

    return ChatSession.create({
      user: userId,
      title: title?.trim() || doc?.title || 'New conversation',
      document: doc?._id,
    });
  }

  public static async getMessages(sessionId: string, userId: string) {
    const session = await ChatSession.findById(sessionId);
    if (!session) throw new AppError('Conversation not found', 404);
    if (session.user.toString() !== userId) throw new AppError('Not authorized', 403);

    const messages = await ChatMessage.find({ session: sessionId }).sort({ createdAt: 1 });
    return { session, messages };
  }

  public static async sendMessage(sessionId: string, userId: string, message: string) {
    const session = await ChatSession.findById(sessionId);
    if (!session) throw new AppError('Conversation not found', 404);
    if (session.user.toString() !== userId) throw new AppError('Not authorized', 403);

    const history = await ChatMessage.find({ session: sessionId }).sort({ createdAt: 1 }).limit(20);

    await ChatMessage.create({ session: sessionId, user: userId, role: 'user', message });

    let documentContext: string | undefined;
    if (session.document) {
      const doc = await StudyDocument.findById(session.document);
      documentContext = doc?.extractedText;
    }

    const reply = await ChatGeminiService.reply(
      message,
      history.map((h) => ({ role: h.role, message: h.message })),
      documentContext
    );

    const assistantMsg = await ChatMessage.create({
      session: sessionId,
      user: userId,
      role: 'assistant',
      message: reply,
    });

    return assistantMsg;
  }

  public static async attachDocument(sessionId: string, userId: string, documentId: string) {
    const session = await ChatSession.findById(sessionId);
    if (!session) throw new AppError('Conversation not found', 404);
    if (session.user.toString() !== userId) throw new AppError('Not authorized', 403);

    const doc = await StudyDocument.findById(documentId);
    if (!doc) throw new AppError('Document not found', 404);
    if (doc.user.toString() !== userId) throw new AppError('Not authorized to use this document', 403);

    session.document = doc._id as any;
    await session.save();
    return session;
  }
}