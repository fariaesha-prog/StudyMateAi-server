export interface CreateResourceInput {
  title: string;
  subject: string;
  category: 'Notes' | 'Flashcards' | 'Quiz' | 'Summary' | 'Cheat Sheet';
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  description?: string;
}

export interface ResourceQuery {
  search?: string;
  category?: string;
  subject?: string;
  sort?: 'popular' | 'newest' | 'rating';
  page?: string;
  pageSize?: string;
  mine?: string;
  status?: string;
   // "true" to fetch only the requesting user's resources
}