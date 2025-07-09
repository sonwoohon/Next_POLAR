import { Score } from '../entities/Score';

export interface ScoreRepositoryInterface {
  getScoresByUserId(userId: number): Promise<Score[]>;
  getScoresByCategoryId(categoryId: number): Promise<Score[]>;
  getScoresBySeason(season: number): Promise<Score[]>;
  getScoresByUserIdAndSeason(userId: number, season: number): Promise<Score[]>;
  getScoresByCategoryIdAndSeason(
    categoryId: number,
    season: number
  ): Promise<Score[]>;
  getScoresByUserIdAndCategoryId(
    userId: number,
    categoryId: number
  ): Promise<Score[]>;
}
