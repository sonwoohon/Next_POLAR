import { Category } from '@/backend/juniors/scores/domains/entities/Category';

export class Score {
  constructor(
    public nickname: string,
    public categoryId: number, // 소분류 ID (sub_categories의 id, 6-19)
    public season: number,
    public categoryScore: number, // sub_categories의 point 값
    public updatedAt: string,
    public category?: Category // 선택적으로 변경
  ) {}
}
