import { useQuery } from '@tanstack/react-query';
import { getHelpById } from '@/lib/api_front/help.api';

export const useHelpDetail = (id: number) => {
  return useQuery({
    queryKey: ['help', 'detail', id],
    queryFn: () => getHelpById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
}; 