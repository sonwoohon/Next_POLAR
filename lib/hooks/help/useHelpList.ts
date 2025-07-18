import { useQuery } from '@tanstack/react-query';
import {
  getHelpList,
  getHelpListWithPagination,
  HelpFilterParams,
} from '@/lib/api_front/help.api';
import { QUERY_KEYS } from '@/lib/constants/api';

export const useHelpList = (filter?: HelpFilterParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.HELPS, filter],
    queryFn: () => getHelpList(filter),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};

export const useHelpListWithPagination = (filter?: HelpFilterParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.HELPS, 'pagination', filter],
    queryFn: () => getHelpListWithPagination(filter),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};
