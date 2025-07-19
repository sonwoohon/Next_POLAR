import { useEffect, useState } from 'react';

interface UserInfo {
  nickname: string;
  role: string;
}

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser
  };
}; 