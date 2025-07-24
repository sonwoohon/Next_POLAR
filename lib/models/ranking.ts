export interface UserRanking {
  nickname: string;
  totalScore: number;
  category: string;
  profileImg: string;
}

export interface User {
  nickname: string;
  profile_img_url: string;
}

export interface ScoreData {
  user_id: string;
  category_score: number;
  category_id: number;
  users: User;
}
