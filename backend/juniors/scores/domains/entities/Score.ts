import { Category } from '@/backend/juniors/scores/domains/entities/Category';

export class Score {
  constructor(
    public userId: number,
    public categoryId: number,
    public season: number,
    public categoryScore: number,
    public updatedAt: string,
    public category: Category
  ) {}
}
