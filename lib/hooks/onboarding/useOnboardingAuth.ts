// 온보딩 페이지 전용 인증 확인 훅 - 쿠키 기반 인증 및 /main 리다이렉트
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useOnboardingAuth = () => {
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 쿠키에서 인증 상태 확인
    useEffect(() => {
    const checkAuthStatus = () => {
        try {
        // 브라우저 환경에서만 실행
        if (typeof window !== 'undefined') {
            const cookies = document.cookie.split(';');
            const accessTokenCookie = cookies.find(cookie => 
            cookie.trim().startsWith('access-token=')
            );
            
            if (accessTokenCookie) {// 인증 토큰 발견, /main으로 리다이렉트
            setIsAuthenticated(true);
            router.replace('/main');

            } else { //인증 토큰 없음, 온보딩 페이지 표시
            setIsAuthenticated(false);
            }
        }
        } catch (error) {
        console.error('[useOnboardingAuth] 인증 확인 중 오류:', error);
        setIsAuthenticated(false);
        } finally {
        setIsCheckingAuth(false);
        }
    };

    checkAuthStatus();
    }, [router]);

    return {
    isCheckingAuth,
    isAuthenticated,
    // 인증 확인 중이면 null 반환하여 아무것도 렌더링하지 않음 
    shouldRender: !isCheckingAuth && !isAuthenticated,
    };
}; 