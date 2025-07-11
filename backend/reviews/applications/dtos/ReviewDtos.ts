import { ReviewEntity } from '@/backend/reviews/domains/entities/review';

export class CreateReviewDto extends ReviewEntity {
  constructor(
    helpId: number,
    writerId: number,
    receiverId: number,
    rating: number,
    text: string
  ) {
    super(0, helpId, writerId, receiverId, rating, text, new Date());
  }
} 