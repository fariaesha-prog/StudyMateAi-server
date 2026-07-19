import { Schema, model, Types } from 'mongoose';

export interface IChatMessage {
  session: Types.ObjectId;
  user: Types.ObjectId;
  role: 'user' | 'assistant';
  message: string;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    session: { type: Schema.Types.ObjectId, ref: 'ChatSession', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const ChatMessage = model<IChatMessage>('ChatMessage', chatMessageSchema);