import { Schema, model, Types } from 'mongoose';

interface IKeyConcept {
  title: string;
  explanation: string;
}

interface IFlashcard {
  question: string;
  answer: string;
}

interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface IStudyDocument {
  user: Types.ObjectId;
  title: string;
  filename: string;
  fileUrl: string;
  mimeType: string;
  extractedText: string;
  summary: string;
  concepts: IKeyConcept[];
  importantTopics: string[];
  flashcards: IFlashcard[];
  quiz: IQuizQuestion[];
  revisionTips: string[];
  status: 'processing' | 'ready' | 'failed';
  errorMessage?: string;
}

const keyConceptSchema = new Schema<IKeyConcept>(
  { title: { type: String, required: true }, explanation: { type: String, required: true } },
  { _id: false }
);

const flashcardSchema = new Schema<IFlashcard>(
  { question: { type: String, required: true }, answer: { type: String, required: true } },
  { _id: false }
);

const quizQuestionSchema = new Schema<IQuizQuestion>(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

const studyDocumentSchema = new Schema<IStudyDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true },
    mimeType: { type: String, required: true },
    extractedText: { type: String, required: true },
    summary: { type: String, default: '' },
    concepts: { type: [keyConceptSchema], default: [] },
    importantTopics: { type: [String], default: [] },
    flashcards: { type: [flashcardSchema], default: [] },
    quiz: { type: [quizQuestionSchema], default: [] },
    revisionTips: { type: [String], default: [] },
    status: { type: String, enum: ['processing', 'ready', 'failed'], default: 'processing' },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export const StudyDocument = model<IStudyDocument>('StudyDocument', studyDocumentSchema);