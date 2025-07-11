import { Score } from '@/backend/juniors/scores/domains/entities/Score';
import {
  ScoreRequestDtoWithCategoryId,
  ScoreRequestDtoWithSeason,
  ScoreRequestDtoWithUserId,
  ScoreRequestDtoWithUserIdAndSeason,
  ScoreRequestDtoWithCategoryIdAndSeason,
  ScoreRequestDtoWithUserIdAndCategoryId,
} from '../../applications/dtos/ScoreRequestDto';

export interface ScoreRepositoryInterface {
  getScoresByUserId(request: ScoreRequestDtoWithUserId): Promise<Score[]>;
  getScoresByCategoryId(
    request: ScoreRequestDtoWithCategoryId
  ): Promise<Score[]>;
  getScoresBySeason(request: ScoreRequestDtoWithSeason): Promise<Score[]>;
  getScoresByUserIdAndSeason(
    request: ScoreRequestDtoWithUserIdAndSeason
  ): Promise<Score[]>;
  getScoresByCategoryIdAndSeason(
    request: ScoreRequestDtoWithCategoryIdAndSeason
  ): Promise<Score[]>;
  getScoresByUserIdAndCategoryId(
    request: ScoreRequestDtoWithUserIdAndCategoryId
  ): Promise<Score[]>;
}
