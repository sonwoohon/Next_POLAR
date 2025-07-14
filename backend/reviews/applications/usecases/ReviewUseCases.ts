import { ReviewEntity } from '@/backend/reviews/domains/entities/review';
import { IReviewRepository } from '@/backend/reviews/domains/repositories/ReviewRepository';
import { CreateReviewRequest } from '@/backend/reviews/applications/dtos/ReviewDtos';
import { getUuidByNickname } from '@/lib/getUserName';

export class ReviewUseCases {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  // nickname으로 받은 리뷰 리스트 조회
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

  // nickname으로 내가 쓴(작성한) 리뷰 리스트 조회
  async getReviewsByWriterNickname(nickname: string): Promise<ReviewEntity[]> {
    const writerId = await getUuidByNickname(nickname);
    if (!writerId) {
      throw new Error(
        `닉네임 "${nickname}"에 해당하는 사용자를 찾을 수 없습니다.`
      );
    }
    return await this.reviewRepository.findByWriterId(writerId);
  }

  // 리뷰 id로 단일 리뷰 상세 조회
  async getReviewById(reviewId: number): Promise<ReviewEntity | null> {
    return await this.reviewRepository.findById(reviewId);
  }

  // 리뷰 생성 (writerNickname을 UUID로 변환)
  async createReview(request: CreateReviewRequest): Promise<ReviewEntity> {
    // writerNickname을 UUID로 변환
    const writerId = await getUuidByNickname(request.writerNickname);
    if (!writerId) {
      throw new Error(
        `닉네임 "${request.writerNickname}"에 해당하는 사용자를 찾을 수 없습니다.`
      );
    }

    // Repository를 통해 receiverId 계산
    const receiverId = await this.reviewRepository.calculateReceiverId(
      request.helpId,
      writerId
    );

    // ReviewEntity 생성
    const reviewEntity = new ReviewEntity(
      undefined, // id는 DB에서 자동 생성
      request.helpId,
      writerId,
      receiverId,
      request.rating,
      request.text,
      undefined // createdAt은 DB에서 자동 생성
    );

    // 리뷰 생성
    return await this.reviewRepository.create(reviewEntity);
  }
}
