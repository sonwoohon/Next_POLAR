import { useQuery } from '@tanstack/react-query';
import { getJuniorAcceptedHelps } from '../../api_front/junior-help.api';

// 주니어가 수락된 Help 리스트 조회 훅
export function useJuniorAcceptedHelps(
  juniorNickname: string,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: ['junior', 'accepted-helps', juniorNickname, page, limit],
    queryFn: () => getJuniorAcceptedHelps(juniorNickname, page, limit),
    enabled: !!juniorNickname,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5분
  });
}
