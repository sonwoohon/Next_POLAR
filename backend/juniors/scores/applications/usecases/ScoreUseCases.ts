// Junior 랭킹 관련 유스케이스
// 이 파일에는 Junior 사용자의 랭킹과 관련된 비즈니스 로직이 구현됩니다.

import { Score } from '@/backend/juniors/scores/domains/entities/Score';
import { ScoreRepositoryInterface } from '@/backend/juniors/scores/domains/repositories/ScoreRepositoryInterface';

// 예시:
// - CalculateJuniorRankUseCase: Junior 랭킹 계산
// - GetJuniorRankingUseCase: Junior 랭킹 조회
// - UpdateJuniorRankUseCase: Junior 랭킹 업데이트
// - AwardJuniorRankUseCase: Junior 랭킹 보상 지급
// - GetRankHistoryUseCase: 랭킹 히스토리 조회

// 유스케이스는 비즈니스 로직을 구현하며, 엔티티를 조작하고 비즈니스 규칙을 적용합니다.

export class GetUserScoresUseCase {
  constructor(private scoreRepository: ScoreRepositoryInterface) {}

  async executeByUserId(userId: number): Promise<Score[]> {
    return await this.scoreRepository.getScoresByUserId(userId);
  }

  async executeByCategoryId(categoryId: number): Promise<Score[]> {
    return await this.scoreRepository.getScoresByCategoryId(categoryId);
  }

  async executeBySeason(season: number): Promise<Score[]> {
    return await this.scoreRepository.getScoresBySeason(season);
  }

  async executeByUserIdAndSeason(
    userId: number,
    season: number
  ): Promise<Score[]> {
    return await this.scoreRepository.getScoresByUserIdAndSeason(
      userId,
      season
    );
  }

  async executeByCategoryIdAndSeason(
    categoryId: number,
    season: number
  ): Promise<Score[]> {
    return await this.scoreRepository.getScoresByCategoryIdAndSeason(
      categoryId,
      season
    );
  }

  async executeByUserIdAndCategoryId(
    userId: number,
    categoryId: number
  ): Promise<Score[]> {
    return await this.scoreRepository.getScoresByUserIdAndCategoryId(
      userId,
      categoryId
    );
  }
}
