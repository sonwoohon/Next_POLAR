import { API_ENDPOINTS } from '@/lib/constants/api';
import apiClient from '@/lib/http.api';

// Score 관련 타입 정의
export interface Score {
  nickname: string;
  categoryId: number; // 소분류 ID (6-19)
  season: number;
  categoryScore: number; // sub_categories의 point 값
  updatedAt: string;
  category?: {
    id: number;
    name: string;
    point: number;
  };
}

export interface ScoreRanking {
  user_id: string;
  users: {
    nickname: string;
    profile_img_url: string;
  };
  category_id: number; // 소분류 ID
  category_score: number; // sub_categories의 point 값
}

// Score API 함수들
export const scoreApi = {
  // 사용자별 전체 점수 조회
  getUserScores: async (): Promise<Score[]> => {
    const response = await apiClient.get(API_ENDPOINTS.USER_SCORES);
    return response.data;
  },

  // 카테고리별 점수 조회
  getScoresByCategory: async (categoryId: number): Promise<Score[]> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CATEGORY_SCORES}?categoryId=${categoryId}`
    );
    return response.data;
  },

  // 시즌별 점수 조회
  getScoresBySeason: async (season: number): Promise<Score[]> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.SEASON_SCORES}?season=${season}`
    );
    return response.data;
  },

  // 사용자별 카테고리 점수 조회
  getUserScoresByCategory: async (categoryId: number): Promise<Score[]> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.USER_CATEGORY_SCORES}?categoryId=${categoryId}`
    );
    return response.data;
  },

  // 사용자별 시즌 점수 조회
  getUserScoresBySeason: async (season: number): Promise<Score[]> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.USER_SEASON_SCORES}?season=${season}`
    );
    return response.data;
  },

  // 카테고리별 시즌 점수 조회
  getScoresByCategoryAndSeason: async (
    categoryId: number,
    season: number
  ): Promise<Score[]> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CATEGORY_SEASON_SCORES}?categoryId=${categoryId}&season=${season}`
    );
    return response.data;
  },

  // 시즌별 랭킹 조회 (Hall of Fame용)
  getSeasonRankings: async (season: number): Promise<ScoreRanking[]> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.SEASON_SCORES_WITH_PARAM}?season=${season}`
    );
    return response.data;
  },
};
