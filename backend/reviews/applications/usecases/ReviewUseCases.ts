import { ReviewEntity } from '@/backend/reviews/domains/entities/review';
import { IReviewRepository } from '@/backend/reviews/domains/repositories/ReviewRepository';
import { CreateReviewRequest } from '@/backend/reviews/applications/dtos/ReviewDtos';
import { getUuidByNickname } from '@/lib/getUserName';

export class ReviewUseCases {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  // 1. nickname으로 받은 리뷰 리스트 조회
  async getReviewsByReceiverNickname(
    nickname: string
  ): Promise<ReviewEntity[]> {
    const receiverId = await getUuidByNickname(nickname);
    if (!receiverId) {
      throw new Error(
        `닉네임 "${nickname}"에 해당하는 사용자를 찾을 수 없습니다.`
      );
    }
    return await this.reviewRepository.findByReceiverId(receiverId);
  }

  // 1-2. nickname으로 내가 쓴(작성한) 리뷰 리스트 조회
  async getReviewsByWriterNickname(nickname: string): Promise<ReviewEntity[]> {
    const writerId = await getUuidByNickname(nickname);
    if (!writerId) {
      throw new Error(
        `닉네임 "${nickname}"에 해당하는 사용자를 찾을 수 없습니다.`
      );
    }
    return await this.reviewRepository.findByWriterId(writerId);
  }

  // 1-3. userId로 받은 리뷰 리스트 조회 (기존 메서드 유지)
  async getReviewsByReceiverId(userId: string): Promise<ReviewEntity[]> {
    return await this.reviewRepository.findByReceiverId(userId);
  }

  // 1-4. userId로 내가 쓴(작성한) 리뷰 리스트 조회 (기존 메서드 유지)
  async getReviewsByWriterId(userId: string): Promise<ReviewEntity[]> {
    return await this.reviewRepository.findByWriterId(userId);
  }

  // 2. 리뷰 id로 단일 리뷰 상세 조회
  async getReviewById(reviewId: number): Promise<ReviewEntity | null> {
    return await this.reviewRepository.findById(reviewId);
  }

  // 3. 리뷰 생성 (receiverId 자동 계산)
  async createReview(request: CreateReviewRequest): Promise<ReviewEntity> {
    // Repository를 통해 receiverId 계산
    const receiverId = await this.reviewRepository.calculateReceiverId(
      request.helpId,
      request.writerId
    );

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
