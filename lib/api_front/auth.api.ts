import apiClient from '@/lib/http.api';
import { API_ENDPOINTS } from '@/lib/constants/api';
import { SignUpDto } from '@/backend/users/signup/applications/dtos/SignUpDto';

// 로그인 API
export const loginApi = async (credentials: {
  loginId: string;
  password: string;
}) => {
  const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
  return response.data;
};

// 회원가입 API
export const signupApi = async (signupData: SignUpDto) => {
  const response = await apiClient.post(API_ENDPOINTS.SIGNUP, signupData);
  return response.data;
};
