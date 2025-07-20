import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptHelpApplicant } from '@/lib/api_front/help.api';
import { QUERY_KEYS } from '@/lib/constants/api';

interface AcceptHelpApplicantParams {
  helpId: number;
  juniorNickname: string;
}

export function useAcceptHelpApplicant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ helpId, juniorNickname }: AcceptHelpApplicantParams) => {
      const response = await acceptHelpApplicant(helpId, juniorNickname);
      return response;
    },
    onSuccess: (data, { helpId }) => {
      // 수락 성공 후 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HELP_DETAIL(helpId.toString()) });
      queryClient.invalidateQueries({ queryKey: ['helpApplicants', helpId] });
      
      console.log('헬프 지원자 수락 성공:', data);
    },
    onError: (error) => {
      console.error('헬프 지원자 수락 실패:', error);
    },
  });
} 