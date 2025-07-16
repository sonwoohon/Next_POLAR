// API 응답용 리뷰 타입
export interface Review {
  id: number;
  helpId: number;
  writerNickname: string;
  receiverNickname: string;
  rating: number;
  text: string;
  reviewImgUrl?: string;
  writerProfileImgUrl?: string;
  createdAt: string;
}

// 받은 리뷰 목록 응답 타입
export interface ReceivedReviewsResponse {
  success: boolean;
  reviews: Review[];
  error?: string;
}

// 쓴 리뷰 목록 응답 타입
export interface WrittenReviewsResponse {
  success: boolean;
  reviews: Review[];
  error?: string;
} 