// 리뷰 생성 요청 DTO
export interface CreateReviewRequest {
  helpId: number;
  writerNickname: string; // nickname으로 변경
  rating: number;
  text: string;
}

// 기존 DTO들...
export class CreateReviewDto {
  constructor(
    public helpId: number,
    public writerNickname: string, // nickname으로 변경
    public receiverNickname: string, // nickname으로 변경
    public rating: number,
    public text: string
  ) {}
}
