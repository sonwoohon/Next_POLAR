import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  withdrawUser,
  WithdrawalRequest,
} from '@/lib/api_front/withdrawal.api';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';

/**
 * 회원 탈퇴를 위한 tanstack query mutation 훅
 *
 * @example
 * ```tsx
 * const { mutate: withdraw, isPending, error } = useWithdrawal();
 *
 * const handleWithdrawal = () => {
 *   withdraw({
 *     userId: 123,
 *     confirmPassword: 'password123',
 *     reason: '서비스 불만족'
 *   });
 * };
 * ```
 */
export const useWithdrawal = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: WithdrawalRequest) => withdrawUser(data),
    onSuccess: () => {
      // 캐시 무효화
      queryClient.clear();

      // 로그아웃 처리
      logout();

      // 홈페이지로 리다이렉트
      router.push('/');
    },
    onError: (error) => {
      console.error('[useWithdrawal] 회원 탈퇴 실패:', error);
    },
  });
};
