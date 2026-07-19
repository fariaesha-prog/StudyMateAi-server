import { Schema, model, Types } from 'mongoose';

export interface IQuiz {
  user: Types.ObjectId;
  resource?: Types.ObjectId;
  subject: string;
  score: number; // percentage 0-100
}

const quizSchema = new Schema<IQuiz>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resource: { type: Schema.Types.ObjectId, ref: 'Resource' },
    subject: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: true }
);

export const Quiz = model<IQuiz>('Quiz', quizSchema);