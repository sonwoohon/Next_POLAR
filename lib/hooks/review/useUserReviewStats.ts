import { useQuery } from '@tanstack/react-query';
import { getUserReviewStats } from '../../api_front/review.api';

// 사용자 리뷰 통계 조회 훅
export function useUserReviewStats(nickname: string) {
  return useQuery({
    queryKey: ['reviews', 'user-stats', nickname],
    queryFn: () => getUserReviewStats(nickname),
    enabled: !!nickname,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5분
  });
}
