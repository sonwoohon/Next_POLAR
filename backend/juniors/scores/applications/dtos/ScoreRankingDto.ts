// 랭킹 조회 결과를 위한 DTO
export interface ScoreRankingDto {
  user_id: string;
  users: {
    nickname: string;
    profile_img_url: string;
  };
  category_id: number; // 소분류 ID (sub_categories의 id, 6-19)
  category_score: number; // sub_categories의 point 값
}

// Supabase에서 반환하는 실제 데이터 구조
export interface ScoreRankingRawDto {
  user_id: string;
  users: {
    nickname: string;
    profile_img_url: string;
  }[];
  category_id: number; // 소분류 ID (sub_categories의 id, 6-19)
  category_score: number; // sub_categories의 point 값
}

// 랭킹 응답을 위한 DTO
export interface ScoreRankingResponseDto {
  rankings: ScoreRankingDto[];
}
