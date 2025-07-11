import { Score } from '@/backend/juniors/scores/domains/entities/Score';

export class ScoreResponseDto {
  constructor(public readonly scores: Score[]) {}
}
