import apiClient from '@/lib/http.api';
import { API_ENDPOINTS } from '@/lib/constants/api';
import { HelpListResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';

export interface JuniorAcceptedHelpsResponse {
  helps: HelpListResponseDto[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// 주니어가 수락된 Help 리스트 조회
export const getJuniorAcceptedHelps = async (
  juniorNickname: string,
  page: number = 1,
  limit: number = 10
): Promise<JuniorAcceptedHelpsResponse> => {
  const response = await apiClient.get<JuniorAcceptedHelpsResponse>(
    `${API_ENDPOINTS.JUNIOR_ACCEPTED_HELPS}?juniorNickname=${juniorNickname}&page=${page}&limit=${limit}`
  );
  return response.data;
};
