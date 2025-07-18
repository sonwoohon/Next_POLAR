'use client';

import { useState, useCallback } from 'react';
import { useHelpVerification } from '@/lib/contexts/HelpVerificationContext';

interface CompletionRequest {
  helpId: number;
  helpTitle: string;
}

interface CompletionResponse {
  success: boolean;
  verificationCode?: number;
  error?: string;
}

export function useSeniorHelpCompletion() {
  const { openSeniorVerificationCodeModal } = useHelpVerification();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 완료 요청 처리
  const requestCompletion = useCallback(
    async ({
      helpId,
      helpTitle,
    }: CompletionRequest): Promise<CompletionResponse> => {
      console.log('🚀 시니어 완료 요청 시작:', { helpId, helpTitle });
      setIsPending(true);
      setError(null);

      try {
        const response = await fetch(`/api/seniors/help/${helpId}/completion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('📡 API 응답:', data);

        if (!response.ok) {
          throw new Error(data.error || '완료 요청에 실패했습니다.');
        }

        const verificationCode = data.verificationCode;
        console.log('🎯 인증번호 받음:', verificationCode);

        if (verificationCode) {
          console.log('🔓 시니어 모달 열기 시도:', {
            helpId,
            helpTitle,
            verificationCode,
          });
          // 시니어에게 인증번호 모달 열기
          openSeniorVerificationCodeModal(helpId, helpTitle, verificationCode);
          console.log('✅ 시니어 모달 열기 완료');
        }

        return {
          success: true,
          verificationCode,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : '알 수 없는 오류가 발생했습니다.';
        console.error('❌ 시니어 완료 요청 오류:', errorMessage);
        setError(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsPending(false);
      }
    },
    [openSeniorVerificationCodeModal]
  );

  return {
    requestCompletion,
    isPending,
    error,
  };
}
