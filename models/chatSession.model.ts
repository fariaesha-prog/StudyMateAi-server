import { Schema, model, Types } from 'mongoose';

export interface IChatSession {
  user: Types.ObjectId;
  title: string;
  document?: Types.ObjectId; // optional — general chats have no document
}

const chatSessionSchema = new Schema<IChatSession>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, default: 'New conversation' },
    document: { type: Schema.Types.ObjectId, ref: 'StudyDocument' },
  },
  { timestamps: true }
);

export const ChatSession = model<IChatSession>('ChatSession', chatSessionSchema);