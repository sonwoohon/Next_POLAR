import { ReviewEntity } from '@/backend/reviews/domains/entities/review';
import { IReviewRepository } from '@/backend/reviews/domains/repositories/ReviewRepository';
import { CreateReviewRequest } from '@/backend/reviews/applications/dtos/ReviewDtos';

export class ReviewUseCases {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  // 1. userId로 받은 리뷰 리스트 조회
  async getReviewsByReceiverId(userId: number): Promise<ReviewEntity[]> {
    return await this.reviewRepository.findByReceiverId(userId);
  }

  // 1-2. userId로 내가 쓴(작성한) 리뷰 리스트 조회
  async getReviewsByWriterId(userId: number): Promise<ReviewEntity[]> {
    return await this.reviewRepository.findByWriterId(userId);
  }

  // 2. 리뷰 id로 단일 리뷰 상세 조회
  async getReviewById(reviewId: number): Promise<ReviewEntity | null> {
    return await this.reviewRepository.findById(reviewId);
  }

  // 3. 리뷰 생성 (receiverId 자동 계산)
  async createReview(request: CreateReviewRequest): Promise<ReviewEntity> {
    // Repository를 통해 receiverId 계산
    const receiverId = await this.reviewRepository.calculateReceiverId(request.helpId, request.writerId);
    
    // ReviewEntity 생성
    const reviewEntity = new ReviewEntity(
      undefined, // id는 DB에서 자동 생성
      request.helpId,
      request.writerId,
      receiverId,
      request.rating,
      request.text,
      undefined // createdAt은 DB에서 자동 생성
    );

    // 리뷰 생성
    return await this.reviewRepository.create(reviewEntity);
  }
}
