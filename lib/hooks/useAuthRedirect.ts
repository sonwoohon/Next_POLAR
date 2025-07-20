import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { QUERY_KEYS } from '../constants/api';



export const useAuthRedirect = () => {
  const router = useRouter();

  // 사용자 정보 조회
  const { data: user, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: async () => {
      const res = await axios.get('/api/users', { withCredentials: true });
      return res.data;
    },
    retry: false, // 실패 시 재시도 안함
  });

  // 역할에 따른 자동 리다이렉트
  useEffect(() => {
    if (user?.role === 'junior') {
      router.replace('/junior');
    } else if (user?.role === 'senior') {
      router.replace('/senior');
    }
    // 비회원이면 현재 페이지에 잔류
  }, [user, router]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}; 