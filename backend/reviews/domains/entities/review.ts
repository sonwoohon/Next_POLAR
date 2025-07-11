export class ReviewEntity {
  constructor(
    public readonly id: number | undefined,           // 리뷰 고유 ID
    public helpId: number,                // 도움 요청 ID
    public writerId: number,              // 작성자 ID
    public receiverId: number,            // 피드백 받는 사람 ID
    public rating: number,                // 평점
    public text: string,                  // 리뷰 내용
    public readonly createdAt: Date | undefined       // 생성일시
  ) {}

  toJSON() {
    return {
      id: this.id,
      helpId: this.helpId,
      writerId: this.writerId,
      receiverId: this.receiverId,
      rating: this.rating,
      text: this.text,
      createdAt: this.createdAt
    };
  }
}
