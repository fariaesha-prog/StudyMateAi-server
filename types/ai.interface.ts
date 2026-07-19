export interface GeminiKeyConcept {
  title: string;
  explanation: string;
}

export interface GeminiFlashcard {
  question: string;
  answer: string;
}

export interface GeminiQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GeminiStudyResponse {
  summary: string;
  concepts: GeminiKeyConcept[];
  importantTopics: string[];
  flashcards: GeminiFlashcard[];
  quiz: GeminiQuizQuestion[];
  revisionTips: string[];
}