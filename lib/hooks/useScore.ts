import { useQuery } from '@tanstack/react-query';
import {
  getUserScores,
  getUserScoresByCategory,
  getUserScoresBySeason,
  getUserScoresByCategoryAndSeason,
  getSeasonRankings,
  getCategoryRankings,
} from '../api_front/score.api';
import { QUERY_KEYS } from '../constants/api';

/**
 * 사용자 전체 점수 조회 훅
 * 
 * @example
 * ```tsx
 * const { data: scores, isLoading, error } = useUserScores();
 * 
 * if (isLoading) return <div>로딩 중...</div>;
 * if (error) return <div>오류 발생</div>;
 * 
 * return (
 *   <div>
 *     {scores?.map(score => (
 *       <div key={score.id}>
 *         {score.categoryName}: {score.score}점 (순위: {score.rank})
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useUserScores = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_SCORES,
    queryFn: getUserScores,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

/**
 * 사용자 카테고리별 점수 조회 훅
 * 
 * @example
 * ```tsx
 * const { data: scores, isLoading } = useUserScoresByCategory(6); // 카테고리 ID 6
 * ```
 */
export const useUserScoresByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_SCORES, 'category', categoryId],
    queryFn: () => getUserScoresByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

/**
 * 사용자 시즌별 점수 조회 훅
 * 
 * @example
 * ```tsx
 * const { data: scores, isLoading } = useUserScoresBySeason(1); // 시즌 1
 * ```
 */
export const useUserScoresBySeason = (season: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_SCORES, 'season', season],
    queryFn: () => getUserScoresBySeason(season),
    enabled: !!season,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

/**
 * 사용자 카테고리 + 시즌별 점수 조회 훅
 * 
 * @example
 * ```tsx
 * const { data: scores, isLoading } = useUserScoresByCategoryAndSeason(6, 1);
 * ```
 */
export const useUserScoresByCategoryAndSeason = (
  categoryId: number,
  season: number
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_SCORES, 'category', categoryId, 'season', season],
    queryFn: () => getUserScoresByCategoryAndSeason(categoryId, season),
    enabled: !!categoryId && !!season,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

/**
 * 시즌별 랭킹 조회 훅 (Hall of Fame용)
 * 
 * @example
 * ```tsx
 * const { data: rankings, isLoading } = useSeasonRankings(1);
 * 
 * return (
 *   <div>
 *     {rankings?.map((ranking, index) => (
 *       <div key={index}>
 *         {ranking.rank}위: {ranking.nickname} - {ranking.score}점
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useSeasonRankings = (season: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SEASON_SCORES, season],
    queryFn: () => getSeasonRankings(season),
    enabled: !!season,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

/**
 * 카테고리별 랭킹 조회 훅
 * 
 * @example
 * ```tsx
 * const { data: rankings, isLoading } = useCategoryRankings(6);
 * ```
 */
export const useCategoryRankings = (categoryId: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CATEGORY_SCORES, categoryId],
    queryFn: () => getCategoryRankings(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
}; 