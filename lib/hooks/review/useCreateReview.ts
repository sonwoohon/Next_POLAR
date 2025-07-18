import { useMutation } from '@tanstack/react-query';
import { createReview } from '../../api_front/review.api';

export function useCreateReview(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (formData: FormData) => createReview(formData),
    ...options,
  });
} 