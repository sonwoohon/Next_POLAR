import { Score } from '../../domains/entities/Score';
import { ScoreRepositoryInterface } from '../../domains/repositories/ScoreRepositoryInterface';
import {
  ScoreRequestDtoWithCategoryId,
  ScoreRequestDtoWithCategoryIdAndSeason,
  ScoreRequestDtoWithSeason,
  ScoreRequestDtoWithUserId,
  ScoreRequestDtoWithUserIdAndCategoryId,
  ScoreRequestDtoWithUserIdAndSeason,
} from '../dtos/ScoreRequestDto';

export class GetUserScoresUseCase {
  constructor(private scoreRepository: ScoreRepositoryInterface) {}

  async executeByUserId(request: ScoreRequestDtoWithUserId): Promise<Score[]> {
    return await this.scoreRepository.getScoresByUserId(request);
  }

  async executeByCategoryId(
    request: ScoreRequestDtoWithCategoryId
  ): Promise<Score[]> {
    return await this.scoreRepository.getScoresByCategoryId(request);
  }

  async executeBySeason(request: ScoreRequestDtoWithSeason): Promise<Score[]> {
    return await this.scoreRepository.getScoresBySeason(request);
  }

  async executeByUserIdAndSeason(
    request: ScoreRequestDtoWithUserIdAndSeason
  ): Promise<Score[]> {
    return await this.scoreRepository.getScoresByUserIdAndSeason(request);
  }

  async executeByCategoryIdAndSeason(
    request: ScoreRequestDtoWithCategoryIdAndSeason
  ): Promise<Score[]> {
    return await this.scoreRepository.getScoresByCategoryIdAndSeason(request);
  }

  async executeByUserIdAndCategoryId(
    request: ScoreRequestDtoWithUserIdAndCategoryId
  ): Promise<Score[]> {
    return await this.scoreRepository.getScoresByUserIdAndCategoryId(request);
  }
}
