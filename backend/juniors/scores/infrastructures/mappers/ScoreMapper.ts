import { Category } from '../../domains/entities/Category';
import { Score } from '../../domains/entities/Score';
import { ScoreDBResponse, ScoreDBResponseSingle } from '../../ScoreModel';

export class ScoreMapper {
  static toScoreEntity({ scores }: ScoreDBResponse) {
    return scores.map((score: ScoreDBResponseSingle) => {
      return new Score(
        score.user_id,
        score.category_id,
        score.season,
        score.category_score,
        score.updated_at,
        new Category(
          score.categories.id,
          score.categories.name,
          score.categories.point
        )
      );
    });
  }
}
