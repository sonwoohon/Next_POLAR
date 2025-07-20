import { useQuery } from '@tanstack/react-query';
import { checkHelpApplicationStatus } from '@/lib/api_front/help.api';
import { QUERY_KEYS } from '@/lib/constants/api';

export function useHelpApplicationStatus(helpId: number) {
  return useQuery({
    queryKey: ['helpApplicationStatus', helpId],
    queryFn: async () => {
      const response = await checkHelpApplicationStatus(helpId);
      return response;
    },
    enabled: !!helpId, // helpId가 있을 때만 실행
  });
} 