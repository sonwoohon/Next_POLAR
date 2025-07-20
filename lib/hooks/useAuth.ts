import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '../constants/api';

interface UserInfo {
  nickname: string;
  role: string;
}

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { logout: logoutStore } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const getCurrentUserFromCookie = () => {
      try {
        const cookies = document.cookie.split(';');
        const accessToken = cookies.find((cookie) =>
          cookie.trim().startsWith('access-token=')
        );

        if (accessToken) {
          const token = accessToken.split('=')[1];
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          if (payload.nickname && payload.role) {
            setCurrentUser({ 
              nickname: payload.nickname, 
              role: payload.role 
            });
          }
        }
      } catch (error) {
        console.error('토큰 파싱 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUserFromCookie();
  }, []);

  const logout = async () => {
    try {
      console.log('[useAuth] 로그아웃 시작');
      
      // 1. 서버에 로그아웃 요청
      const response = await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        console.warn('[useAuth] 서버 로그아웃 실패, 클라이언트에서 처리 계속');
      }

      // 2. 클라이언트 쿠키 삭제
      document.cookie = 'access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // 3. Zustand Store 초기화
      logoutStore();

      // 4. 로컬 상태 초기화
      setCurrentUser(null);

      console.log('[useAuth] 로그아웃 완료');
      
      // 5. 홈페이지로 리다이렉트
      router.push('/');
    } catch (error) {
      console.error('[useAuth] 로그아웃 중 오류:', error);
      
      // 에러가 발생해도 클라이언트에서 로그아웃 처리
      document.cookie = 'access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      logoutStore();
      setCurrentUser(null);
      router.push('/');
    }
  };

  return {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    logout
  };
}; 