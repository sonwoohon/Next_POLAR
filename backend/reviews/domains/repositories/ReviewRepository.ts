import { ReviewEntity } from '@/backend/reviews/domains/entities/review';
import { CreateReviewRequest, ReviewCreateAccessRequestDto } from '@/backend/reviews/applications/dtos/ReviewDtos';

export interface IReviewRepository {
  // nickname으로 받은 리뷰 리스트 조회
  findByReceiverNickname(nickname: string): Promise<ReviewEntity[]>;

  // nickname으로 내가 쓴(작성한) 리뷰 리스트 조회
  findByWriterNickname(nickname: string): Promise<ReviewEntity[]>;

  // 리뷰 생성
  createByNicknames(request: CreateReviewRequest): Promise<ReviewEntity>;

  // 리뷰 생성 권한 확인
  checkCreateReviewAccess(dto: ReviewCreateAccessRequestDto): Promise<boolean>;
}
