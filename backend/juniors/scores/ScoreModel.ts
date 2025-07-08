import { Category } from './domains/entities/Category';

export interface ScoreDBResponse {
  scores: ScoreDBResponseSingle[];
}

export interface ScoreDBResponseSingle {
  user_id: number;
  category_id: number;
  season: number;
  category_score: number;
  updated_at: string;
  categories: Category;
}
