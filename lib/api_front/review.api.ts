import { API_ENDPOINTS } from '../constants/api';
import apiClient from '../http.api';
import { Review, ReceivedReviewsResponse, WrittenReviewsResponse } from '../models/review.model';

// 받은 리뷰 목록 조회
export const getReceivedReviews = async (nickname: string): Promise<ReceivedReviewsResponse> => {
  const response = await apiClient.get<ReceivedReviewsResponse>(
    `${API_ENDPOINTS.REVIEWS_RECEIVED}?nickname=${nickname}`
  );
  return response.data;
};

// 쓴 리뷰 목록 조회
export const getWrittenReviews = async (nickname: string): Promise<WrittenReviewsResponse> => {
  const response = await apiClient.get<WrittenReviewsResponse>(
    `${API_ENDPOINTS.REVIEWS_WRITTEN}?nickname=${nickname}`
  );
  return response.data;
}; 