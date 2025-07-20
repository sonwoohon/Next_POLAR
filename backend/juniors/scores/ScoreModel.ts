import { Category } from '@/backend/juniors/scores/domains/entities/Category';

export interface ScoreDBResponse {
  scores: ScoreDBResponseSingle[];
}

export interface ScoreDBResponseSingle {
  user_id: string; // UUID
  nickname?: string; // JOIN으로 가져올 수 있는 필드
  category_id: number; // 소분류 ID (sub_categories의 id, 6-19)
  season: number;
  category_score: number; // sub_categories의 point 값
  updated_at: string;
  categories?: Category; // JOIN으로 가져올 수 있는 필드
  users?: {
    nickname: string;
    profile_img_url?: string;
  };
}
