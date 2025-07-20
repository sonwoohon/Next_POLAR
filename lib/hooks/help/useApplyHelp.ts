import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applyHelp } from '@/lib/api_front/help.api';
import { QUERY_KEYS } from '@/lib/constants/api';

export function useApplyHelp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (helpId: number) => {
      const response = await applyHelp(helpId);
      return response;
    },
    onSuccess: (data, helpId) => {
      // 지원 성공 후 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HELP_DETAIL(helpId.toString()) });
      queryClient.invalidateQueries({ queryKey: ['helpApplicants', helpId] });
      queryClient.invalidateQueries({ queryKey: ['helpApplicationStatus', helpId] });
      
      console.log('헬프 지원 성공:', data);
    },
    onError: (error) => {
      console.error('헬프 지원 실패:', error);
    },
  });
} 