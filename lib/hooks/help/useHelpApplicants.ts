import { useQuery } from '@tanstack/react-query';
import { getHelpApplicants } from '@/lib/api_front/help.api';

interface HelpApplicant {
  id: number;
  helpId: number;
  juniorId: string;
  isAccepted: boolean;
  appliedAt: string;
}

interface HelpApplicantsResponse {
  success: boolean;
  applicants: HelpApplicant[];
  error?: string;
}

export function useHelpApplicants(helpId: number) {
  return useQuery({
    queryKey: ['helpApplicants', helpId],
    queryFn: async (): Promise<HelpApplicantsResponse> => {
      const response = await getHelpApplicants(helpId);
      return response;
    },
    enabled: !!helpId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
} 