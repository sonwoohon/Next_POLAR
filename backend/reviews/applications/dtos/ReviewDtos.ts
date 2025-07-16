// 리뷰 생성 요청 DTO
export interface CreateReviewRequest {
  helpId: number;
  writerNickname: string; // nickname
  rating: number;
  text: string;
  reviewImgUrl?: string; // 리뷰 이미지 URL (선택사항)
}

}
