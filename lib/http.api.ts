import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { useAuthStore } from './stores/authStore';

// API 기본 설정
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000');

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error);

    // 에러 처리
    if (error.response) {
      // 서버에서 응답이 왔지만 에러 상태인 경우
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.error('[API] 인증 실패 - 세션 만료');

          // 브라우저 환경에서만 실행
          if (typeof window !== 'undefined') {
            // 1. 쿠키 삭제
            document.cookie =
              'access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie =
              'refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            // 2. authStore 초기화
            const logout = useAuthStore.getState().logout;
            logout();

            // 3. 사용자에게 알림
            alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');

            // 4. 로그인 페이지로 리다이렉트
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('[API] 권한 없음');
          break;
        case 404:
          console.error('[API] 리소스를 찾을 수 없음');
          break;
        case 500:
          console.error('[API] 서버 오류');
          break;
        default:
          console.error(`[API] ${status} 오류:`, data);
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('[API] 네트워크 오류');
    } else {
      // 요청 설정 중 오류
      console.error('[API] 요청 설정 오류:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
