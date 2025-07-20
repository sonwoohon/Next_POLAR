import { useQuery } from '@tanstack/react-query';
import { scoreApi } from '@/lib/api_front/score.api';

// Score 관련 React Query 훅들
export const useScores = () => {
  return useQuery({
    queryKey: ['scores'],
    queryFn: scoreApi.getUserScores,
  });
};

export const useScoresByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ['scores', 'category', categoryId],
    queryFn: () => scoreApi.getScoresByCategory(categoryId),
    enabled: !!categoryId,
  });
};

export const useScoresBySeason = (season: number) => {
  return useQuery({
    queryKey: ['scores', 'season', season],
    queryFn: () => scoreApi.getScoresBySeason(season),
    enabled: !!season,
  });
};

export const useUserScoresByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ['scores', 'user', 'category', categoryId],
    queryFn: () => scoreApi.getUserScoresByCategory(categoryId),
    enabled: !!categoryId,
  });
};

export const useUserScoresBySeason = (season: number) => {
  return useQuery({
    queryKey: ['scores', 'user', 'season', season],
    queryFn: () => scoreApi.getUserScoresBySeason(season),
    enabled: !!season,
  });
};

export const useUserScoresWithSeason = (season: number) => {
  return useQuery({
    queryKey: ['scores', 'user', 'season-scores', season],
    queryFn: () => scoreApi.getUserScoresWithSeason(season),
    enabled: !!season,
  });
};

export const useScoresByCategoryAndSeason = (
  categoryId: number,
  season: number
) => {
  return useQuery({
    queryKey: ['scores', 'category', categoryId, 'season', season],
    queryFn: () => scoreApi.getScoresByCategoryAndSeason(categoryId, season),
    enabled: !!categoryId && !!season,
  });
};

export const useSeasonRankings = (season: number) => {
  return useQuery({
    queryKey: ['scores', 'rankings', 'season', season],
    queryFn: () => scoreApi.getSeasonRankings(season),
    enabled: !!season,
  });
};
