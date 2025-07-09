import { ReviewEntity } from '@/backend/reviews/domains/entities/review';

export interface IReviewRepository {
  // helpId로 리뷰 리스트 조회
  findByHelpId(helpId: number): Promise<ReviewEntity[]>;

  // 리뷰 id로 단일 리뷰 상세 조회
  findById(reviewId: number): Promise<ReviewEntity | null>;

  // 리뷰 생성
  create(review: Omit<ReviewEntity, 'id' | 'createdAt'>): Promise<ReviewEntity>;
} 