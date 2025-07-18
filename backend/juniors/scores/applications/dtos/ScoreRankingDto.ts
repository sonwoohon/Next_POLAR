// 랭킹 조회 결과를 위한 DTO
export interface ScoreRankingDto {
  user_id: string;
  users: {
    nickname: string;
    profile_img_url: string;
  };
  category_id: number;
  category_score: number;
}

// Supabase에서 반환하는 실제 데이터 구조
export interface ScoreRankingRawDto {
  user_id: string;
  users: {
    nickname: string;
    profile_img_url: string;
  }[];
  category_id: number;
  category_score: number;
}

// 랭킹 응답을 위한 DTO
export interface ScoreRankingResponseDto {
  rankings: ScoreRankingDto[];
} 