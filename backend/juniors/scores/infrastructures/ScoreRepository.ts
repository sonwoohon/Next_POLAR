// Junior 랭킹 관련 인프라스트럭처
// 이 파일에는 Junior 사용자의 랭킹과 관련된 외부 의존성 구현이 포함됩니다.

// 예시:
// - SupabaseJuniorRankRepository: Supabase 기반 랭킹 리포지토리
// - RedisCacheService: Redis 캐시 서비스
// - RankingCalculationService: 랭킹 계산 서비스
// - RewardService: 보상 지급 서비스
// - AnalyticsService: 분석 서비스

// 인프라스트럭처는 외부 의존성의 실제 구현을 담당하며, 인터페이스를 구현합니다.
import { supabase } from '@/lib/supabase';
import { ScoreRepositoryInterface } from '../domains/repositories/ScoreRepositoryInterface';
import { Score } from '../domains/entities/Score';
import { ScoreMapper } from './mappers/ScoreMapper';
import { ScoreDBResponse } from '../ScoreModel';

const scoreColumns = `
user_id,
category_id,
season,
category_score,
updated_at,
categories (
  id,
  name,
  point
)
`;

export class ScoreRepository implements ScoreRepositoryInterface {
  async getScoresByUserId(userId: number): Promise<Score[]> {
    const { data, error } = await supabase
      .from('scores')
      .select(`${scoreColumns}`)
      .eq('user_id', userId);

    if (error || !data) return [];

    return ScoreMapper.toScoreEntity({
      scores: data,
    } as unknown as ScoreDBResponse);
  }

  async getScoresByCategoryId(categoryId: number): Promise<Score[]> {
    const { data, error } = await supabase
      .from('scores')
      .select(`${scoreColumns}`)
      .eq('category_id', categoryId);

    if (error || !data) return [];

    return ScoreMapper.toScoreEntity({
      scores: data,
    } as unknown as ScoreDBResponse);
  }

  async getScoresBySeason(season: number): Promise<Score[]> {
    const { data, error } = await supabase
      .from('scores')
      .select(`${scoreColumns}`)
      .eq('season', season);

    if (error || !data) return [];

    return ScoreMapper.toScoreEntity({
      scores: data,
    } as unknown as ScoreDBResponse);
  }

  async getScoresByUserIdAndSeason(
    userId: number,
    season: number
  ): Promise<Score[]> {
    const { data, error } = await supabase
      .from('scores')
      .select(`${scoreColumns}`)
      .eq('user_id', userId)
      .eq('season', season);

    if (error || !data) return [];

    return ScoreMapper.toScoreEntity({
      scores: data,
    } as unknown as ScoreDBResponse);
  }

  async getScoresByCategoryIdAndSeason(
    categoryId: number,
    season: number
  ): Promise<Score[]> {
    const { data, error } = await supabase
      .from('scores')
      .select(`${scoreColumns}`)
      .eq('category_id', categoryId)
      .eq('season', season);

    if (error || !data) return [];

    return ScoreMapper.toScoreEntity({
      scores: data,
    } as unknown as ScoreDBResponse);
  }

  async getScoresByUserIdAndCategoryId(
    userId: number,
    categoryId: number
  ): Promise<Score[]> {
    const { data, error } = await supabase
      .from('scores')
      .select(`${scoreColumns}`)
      .eq('user_id', userId)
      .eq('category_id', categoryId);

    if (error || !data) return [];

    return ScoreMapper.toScoreEntity({
      scores: data,
    } as unknown as ScoreDBResponse);
  }
}
