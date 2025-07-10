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
import { ScoreRepositoryInterface } from '@/backend/juniors/scores/domains/repositories/ScoreRepositoryInterface';
import { Score } from '@/backend/juniors/scores/domains/entities/Score';
import { ScoreMapper } from '@/backend/juniors/scores/infrastructures/mappers/ScoreMapper';
import { ScoreDBResponse } from '@/backend/juniors/scores/ScoreModel';

export class ScoreRepository implements ScoreRepositoryInterface {
  private async queryScores(filters: Record<string, number>): Promise<Score[]> {
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
    // eq 반복 방식
    // let query = supabase.from('scores').select(scoreColumns);
    // for (const [key, value] of Object.entries(filters)) {
    //   query = query.eq(key, value);
    // }

    // match 방식 (여러 조건 동시 필터링)
    const { data, error } = await supabase
      .from('scores')
      .select(scoreColumns)
      .match(filters);

    if (error || !data) return [];

    return ScoreMapper.toScoreEntity({
      scores: data,
    } as unknown as ScoreDBResponse);
  }

  async getScoresByUserId(userId: number): Promise<Score[]> {
    return this.queryScores({ user_id: userId });
  }

  async getScoresByCategoryId(categoryId: number): Promise<Score[]> {
    return this.queryScores({ category_id: categoryId });
  }

  async getScoresBySeason(season: number): Promise<Score[]> {
    return this.queryScores({ season });
  }

  async getScoresByUserIdAndSeason(
    userId: number,
    season: number
  ): Promise<Score[]> {
    return this.queryScores({ user_id: userId, season });
  }

  async getScoresByCategoryIdAndSeason(
    categoryId: number,
    season: number
  ): Promise<Score[]> {
    return this.queryScores({ category_id: categoryId, season });
  }

  async getScoresByUserIdAndCategoryId(
    userId: number,
    categoryId: number
  ): Promise<Score[]> {
    return this.queryScores({ user_id: userId, category_id: categoryId });
  }
}
