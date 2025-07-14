import { ReviewEntity } from '@/backend/reviews/domains/entities/review';

export interface IReviewRepository {
  // userId로 받은 리뷰 리스트 조회
  findByReceiverId(userId: string): Promise<ReviewEntity[]>;

  // userId로 내가 쓴(작성한) 리뷰 리스트 조회
  findByWriterId(userId: string): Promise<ReviewEntity[]>;

  // nickname으로 받은 리뷰 리스트 조회
  findByReceiverNickname(nickname: string): Promise<ReviewEntity[]>;

  // nickname으로 내가 쓴(작성한) 리뷰 리스트 조회
  findByWriterNickname(nickname: string): Promise<ReviewEntity[]>;

  // 리뷰 id로 단일 리뷰 상세 조회
  findById(reviewId: number): Promise<ReviewEntity | null>;

  // 리뷰 생성
  create(review: Omit<ReviewEntity, 'id' | 'createdAt'>): Promise<ReviewEntity>;

  // helpId와 writerId로 receiverId 계산
  calculateReceiverId(helpId: number, writerId: string): Promise<string>;
}
