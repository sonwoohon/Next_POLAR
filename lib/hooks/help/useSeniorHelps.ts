import { useQuery } from '@tanstack/react-query';
import { getSeniorHelps } from '@/lib/api_front/help.api';
import { QUERY_KEYS } from '@/lib/constants/api';
import { SeniorHelpsResponseDto } from '@/backend/seniors/helps/applications/dtos/SeniorHelpsResponseDto';

export function useSeniorHelps() {
  return useQuery<SeniorHelpsResponseDto>({
    queryKey: QUERY_KEYS.SENIOR_HELPS_LIST,
    queryFn: async () => {
      const response = await getSeniorHelps();
      return response;
    },
  });
} 