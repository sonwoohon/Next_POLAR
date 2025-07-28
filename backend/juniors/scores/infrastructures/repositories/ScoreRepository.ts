import { supabase } from '@/backend/common/utils/supabaseClient';
import { Score } from '@/backend/juniors/scores/domains/entities/Score';
import { ScoreMapper } from '@/backend/juniors/scores/infrastructures/mappers/ScoreMapper';
import { ScoreDBResponse } from '@/backend/juniors/scores/ScoreModel';
import { ScoreRepositoryInterface } from '@/backend/juniors/scores/domains/repositories/ScoreRepositoryInterface';
import {
  ScoreRequestDtoWithCategoryId,
  ScoreRequestDtoWithCategoryIdAndSeason,
  ScoreRequestDtoWithSeason,
  ScoreRequestDtoWithNickname,
  ScoreRequestDtoWithNicknameAndSeason,
  ScoreRequestDtoWithNicknameAndCategoryId,
} from '@/backend/juniors/scores/applications/dtos/ScoreRequestDto';
import {
  ScoreRankingDto,
  ScoreRankingRawDto,
} from '@/backend/juniors/scores/applications/dtos/ScoreRankingDto';

export class ScoreRepository implements ScoreRepositoryInterface {
  private async queryScores(
    filters: Record<string, number | string>
  ): Promise<Score[]> {
    const scoreColumns = `
      user_id,
      category_id,
      season,
      category_score,
      updated_at
      `;

    const { data, error } = await supabase
      .from('scores')
      .select(scoreColumns)
      .match(filters);

    if (error || !data) return [];

    return ScoreMapper.toScoreEntity({
      scores: data,
    } as unknown as ScoreDBResponse);
  }

  // nickname 기반 조회를 위한 메서드 (JOIN 사용)
  private async queryScoresByNickname(
    nickname: string,
    additionalFilters: Record<string, number | string> = {}
  ): Promise<Score[]> {
    const scoreColumns = `
      user_id,
      users!inner(nickname),
      category_id,
      season,
      category_score,
      updated_at
    `;

    // nickname으로 scores 조회 (JOIN 사용)
    let query = supabase
      .from('scores')
      .select(scoreColumns)
      .eq('users.nickname', nickname);

    // 추가 필터 적용
    for (const [key, value] of Object.entries(additionalFilters)) {
      query = query.eq(key, value);
    }

    const { data, error } = await query;

    if (error || !data) return [];

    return ScoreMapper.toScoreEntity({
      scores: data,
    } as unknown as ScoreDBResponse);
  }

  async getScoresByCategoryId(
    request: ScoreRequestDtoWithCategoryId
  ): Promise<Score[]> {
    return this.queryScores({ category_id: request.categoryId });
  }

  async getScoresBySeason(
    request: ScoreRequestDtoWithSeason
  ): Promise<Score[]> {
    return this.queryScores({ season: request.season });
  }

  async getScoresByCategoryIdAndSeason(
    request: ScoreRequestDtoWithCategoryIdAndSeason
  ): Promise<Score[]> {
    return this.queryScores({
      category_id: request.categoryId,
      season: request.season,
    });
  }

  // nickname 기반 메서드들
  async getScoresByNickname(
    request: ScoreRequestDtoWithNickname
  ): Promise<Score[]> {
    return this.queryScoresByNickname(request.nickname);
  }

  async getScoresByNicknameAndSeason(
    request: ScoreRequestDtoWithNicknameAndSeason
  ): Promise<Score[]> {
    return this.queryScoresByNickname(request.nickname, {
      season: request.season,
    });
  }

  async getScoresByNicknameAndCategoryId(
    request: ScoreRequestDtoWithNicknameAndCategoryId
  ): Promise<Score[]> {
    return this.queryScoresByNickname(request.nickname, {
      category_id: request.categoryId,
    });
  }

  // user_id별 총점과 nickname을 가져오는 메서드 (Hall of Fame용)
  async getUserRankingsBySeason(season: number): Promise<ScoreRankingDto[]> {
    const { data, error } = await supabase
      .from('scores')
      .select(
        `
        user_id,
        users(nickname, profile_img_url),
        category_id,
        category_score
      `
      )
      .eq('season', season);

    if (error || !data) return [];

    // Supabase 응답을 ScoreRankingDto 형태로 변환
    return (data as ScoreRankingRawDto[]).map((item) => ({
      user_id: item.user_id,
      users: Array.isArray(item.users) ? item.users[0] : item.users, // 배열이면 첫 번째 요소, 아니면 그대로
      category_id: item.category_id,
      category_score: item.category_score,
    }));
  }
}
