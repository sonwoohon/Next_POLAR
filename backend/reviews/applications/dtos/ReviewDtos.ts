import { ReviewEntity } from '@/backend/reviews/domains/entities/review';

// 리뷰 생성 요청 DTO
export interface CreateReviewRequest {
  helpId: number;
  writerId: number;
  rating: number;
  text: string;
}

// 기존 DTO들...
export class CreateReviewDto {
  constructor(
    public helpId: number,
    public writerId: number,
    public receiverId: number,
    public rating: number,
    public text: string
  ) {}
} 