import { Schema, model, Types } from 'mongoose';

interface IPlanDay {
  dayOffset: number;
  date: Date;
  focusTopics: string[];
  tasks: string[];
  estimatedHours: number;
  completed: boolean;
}

export interface IStudyPlan {
  user: Types.ObjectId;
  examName: string;
  examDate: Date;
  topics: string[];
  days: IPlanDay[];
  tips: string[];
}

const planDaySchema = new Schema<IPlanDay>(
  {
    dayOffset: { type: Number, required: true },
    date: { type: Date, required: true },
    focusTopics: { type: [String], default: [] },
    tasks: { type: [String], default: [] },
    estimatedHours: { type: Number, default: 1 },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const studyPlanSchema = new Schema<IStudyPlan>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    examName: { type: String, required: true, trim: true },
    examDate: { type: Date, required: true },
    topics: { type: [String], required: true },
    days: { type: [planDaySchema], default: [] },
    tips: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const StudyPlan = model<IStudyPlan>('StudyPlan', studyPlanSchema);