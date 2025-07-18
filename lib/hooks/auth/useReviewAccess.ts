import { useQuery } from '@tanstack/react-query';
import { checkReviewCreateAccess } from '@/lib/api_front/review.api';

interface UseReviewAccessProps {
  nickname: string;
  helpId: number;
}

export const useReviewAccess = ({ nickname, helpId }: UseReviewAccessProps) => {
  return useQuery({
    queryKey: ['reviewAccess', nickname, helpId],
    queryFn: () => checkReviewCreateAccess(nickname, helpId),
    enabled: !!nickname && !!helpId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 1, // 실패 시 1번만 재시도
  });
}; 