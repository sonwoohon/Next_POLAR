import { Score } from '../../domains/entities/Score';

export class ScoreResponseDto {
  constructor(public readonly scores: Score[]) {}
}
