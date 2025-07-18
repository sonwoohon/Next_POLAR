import { API_ENDPOINTS } from '../constants/api';
import apiClient from '../http.api';
import { ApiCreateHelpResponse } from '../models/createHelpDto';
import axios from 'axios';

export const postHelp = async (formData: FormData) => {
  const response = await apiClient.post<ApiCreateHelpResponse>(
    API_ENDPOINTS.SENIOR_HELPS,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const getHelpParticipants = async (helpId: number) => {
  try {
    const response = await axios.get(`/api/helps/${helpId}/participants`);
    return response.data;
  } catch (error) {
    console.error('Help 참여자 정보 조회 오류:', error);
    throw error;
  }
};
