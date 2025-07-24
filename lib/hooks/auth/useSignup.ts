import { useMutation } from '@tanstack/react-query';
import { signupApi } from '@/lib/api_front/auth.api';
import { SignUpDto } from '@/backend/users/signup/applications/dtos/SignUpDto';
import { useRouter } from 'next/navigation';

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (signupData: SignUpDto) => signupApi(signupData),
    onSuccess: () => {
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      router.push('/login');
    },
    onError: (error) => {
      console.error('[useSignup] 회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
