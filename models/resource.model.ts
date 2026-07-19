import { Schema, model, Types } from 'mongoose';

export interface IResource {
  user: Types.ObjectId;
  title: string;
  subject: string;
  category: 'Notes' | 'Flashcards' | 'Quiz' | 'Summary' | 'Cheat Sheet';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  fileUrl: string;
  pages: number;
  status: 'Processing' | 'Ready';
  rating: number;
  ratingsCount: number;
  downloads: number;
}

const resourceSchema = new Schema<IResource>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    category: {
      type: String,
      enum: ['Notes', 'Flashcards', 'Quiz', 'Summary', 'Cheat Sheet'],
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    description: { type: String, default: '' },
    fileUrl: { type: String, required: true },
    pages: { type: Number, default: 0 },
    status: { type: String, enum: ['Processing', 'Ready'], default: 'Processing' },
    rating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Resource = model<IResource>('Resource', resourceSchema);