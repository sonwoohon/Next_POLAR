import { API_ENDPOINTS } from '../constants/api';
import apiClient from '../http.api';
import { ScoreData } from '../models/ranking';

// 점수 조회 응답 인터페이스
export interface Score {
  id?: string;
  userId?: string;
  nickname: string;
  categoryId: number;
  categoryName?: string;
  season: number;
  score?: number;
  categoryScore: number;
  rank?: number;
  createdAt?: string;
  updatedAt: string;
}

// 랭킹 조회 응답 인터페이스
export interface ScoreRanking {
  nickname: string;
  categoryName: string;
  season: number;
  score: number;
  rank: number;
}

// 사용자 점수 조회 (전체)
export const getUserScores = async (): Promise<Score[]> => {
  const response = await apiClient.get<Score[]>(API_ENDPOINTS.SCORES.USER);
  return response.data;
};

// 사용자 점수 조회 (카테고리별)
export const getUserScoresByCategory = async (
  categoryId: number
): Promise<Score[]> => {
  const response = await apiClient.get<Score[]>(
    `${API_ENDPOINTS.SCORES.USER_WITH_CATEGORY}?categoryId=${categoryId}`
  );
  return response.data;
};

// 사용자 점수 조회 (시즌별)
export const getUserScoresBySeason = async (
  season: number
): Promise<Score[]> => {
  const response = await apiClient.get<Score[]>(
    `${API_ENDPOINTS.SCORES.USER_WITH_SEASON}?season=${season}`
  );
  return response.data;
};

// 사용자 점수 조회 (시즌별 - USER_SEASON_SCORES 엔드포인트 사용)
export const getUserScoresWithSeason = async (
  season: number
): Promise<Score[]> => {
  const response = await apiClient.get<Score[]>(
    `${API_ENDPOINTS.USER_SEASON_SCORES}?season=${season}`
  );
  return response.data;
};

// 사용자 점수 조회 (카테고리 + 시즌별)
export const getUserScoresByCategoryAndSeason = async (
  categoryId: number,
  season: number
): Promise<Score[]> => {
  const response = await apiClient.get<Score[]>(
    `${API_ENDPOINTS.SCORES.CATEGORY_WITH_SEASON}?categoryId=${categoryId}&season=${season}`
  );
  return response.data;
};

// 시즌별 랭킹 조회
export const getSeasonRankings = async (
  season: number
): Promise<ScoreRanking[]> => {
  const response = await apiClient.get<ScoreRanking[]>(
    `${API_ENDPOINTS.SCORES.SEASON}?season=${season}`
  );
  return response.data;
};

// 카테고리별 랭킹 조회
export const getCategoryRankings = async (
  categoryId: number
): Promise<ScoreRanking[]> => {
  const response = await apiClient.get<ScoreRanking[]>(
    `${API_ENDPOINTS.SCORES.CATEGORY}?categoryId=${categoryId}`
  );
  return response.data;
};

// 명예의 전당용 시즌 점수 조회
export const getSeasonScoresWithParam = async (
  season: number
): Promise<ScoreData[]> => {
  const response = await apiClient.get<ScoreData[]>(
    `${API_ENDPOINTS.SEASON_SCORES_WITH_PARAM}?season=${season}`
  );
  return response.data;
};

// scoreApi 객체로 모든 함수들을 export
export const scoreApi = {
  getUserScores,
  getUserScoresByCategory,
  getUserScoresBySeason,
  getUserScoresWithSeason,
  getUserScoresByCategoryAndSeason,
  getSeasonRankings,
  getCategoryRankings,
  getSeasonScoresWithParam,
  // useScores.ts에서 사용하는 메서드명들 추가
  getScoresByCategory: getUserScoresByCategory,
  getScoresBySeason: getUserScoresBySeason,
  getScoresByCategoryAndSeason: getUserScoresByCategoryAndSeason,
};
