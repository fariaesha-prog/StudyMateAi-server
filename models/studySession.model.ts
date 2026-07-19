import { Schema, model, Types } from 'mongoose';

export interface IStudySession {
  user: Types.ObjectId;
  date: Date; // day this session belongs to (midnight-normalized)
  durationMinutes: number;
}

const studySessionSchema = new Schema<IStudySession>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export const StudySession = model<IStudySession>('StudySession', studySessionSchema);