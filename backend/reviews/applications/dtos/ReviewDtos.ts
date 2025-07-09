export type CreateReviewDto = {
  helpId: number;
  writerId: number;
  receiverId: number;
  rating: number;
  text: string;
}; 