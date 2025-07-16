import { useMutation } from '@tanstack/react-query';
import { createReview } from '../api_front/review.api';
import { CreateReviewRequest } from '../models/review.model';

export function useCreateReview(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (reviewData: CreateReviewRequest) => createReview(reviewData),
    ...options,
  });
} 