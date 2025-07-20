import { API_ENDPOINTS } from '../constants/api';
import apiClient from '../http.api';

// 회원 탈퇴 요청 인터페이스
export interface WithdrawalRequest {
  userId: number;
  confirmPassword: string;
  reason?: string;
}

// 회원 탈퇴 응답 인터페이스
export interface WithdrawalResponse {
  success: boolean;
  message: string;
  userId?: number;
}

// 회원 탈퇴 API 호출
export const withdrawUser = async (data: WithdrawalRequest): Promise<WithdrawalResponse> => {
  const response = await apiClient.post<WithdrawalResponse>(
    API_ENDPOINTS.WITHDRAWAL,
    data
  );
  return response.data;
}; 