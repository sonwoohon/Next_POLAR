import { ReviewEntity } from '@/backend/reviews/domains/entities/review';

export interface IReviewRepository {
  // nickname으로 받은 리뷰 리스트 조회
  findByReceiverNickname(nickname: string): Promise<ReviewEntity[]>;

  // nickname으로 내가 쓴(작성한) 리뷰 리스트 조회
  findByWriterNickname(nickname: string): Promise<ReviewEntity[]>;

  // 리뷰 id로 단일 리뷰 상세 조회
  findById(reviewId: number): Promise<ReviewEntity | null>;

  // nickname 기반 리뷰 생성
  createByNicknames(request: any): Promise<ReviewEntity>;
}
