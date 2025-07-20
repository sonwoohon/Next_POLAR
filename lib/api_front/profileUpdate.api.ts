import { API_ENDPOINTS, QUERY_KEYS } from '../constants/api';
import apiClient from '../http.api';
import { UserProfileResponseDto } from '@/backend/common/dtos/UserDto';
import { ApiResponse } from '../http.api';

// 프로필 업데이트 요청 타입
export interface ProfileUpdateRequest {
  name?: string;
  address?: string;
}

// 비밀번호 변경 요청 타입
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

// 프로필 이미지 업데이트 응답 타입
export interface ProfileImageUpdateResponse {
  profileImgUrl: string;
}

// 프로필 정보 조회
export const getUserProfileForUpdate = async (nickname: string): Promise<UserProfileResponseDto> => {
  const response = await apiClient.get<ApiResponse<UserProfileResponseDto>>(
    API_ENDPOINTS.USER_PROFILE_UPDATE(nickname)
  );
  return response.data.data!;
};

// 프로필 정보 업데이트
export const updateUserProfile = async (
  nickname: string,
  profileData: ProfileUpdateRequest
): Promise<UserProfileResponseDto> => {
  const response = await apiClient.put<ApiResponse<UserProfileResponseDto>>(
    API_ENDPOINTS.USER_PROFILE_UPDATE(nickname),
    profileData
  );
  return response.data.data!;
};

// 프로필 이미지 업데이트
export const updateUserProfileImage = async (
  nickname: string,
  imageFile: File
): Promise<ProfileImageUpdateResponse> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await apiClient.patch<ApiResponse<ProfileImageUpdateResponse>>(
    API_ENDPOINTS.USER_PROFILE_UPDATE(nickname),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data!;
};

// 비밀번호 변경
export const changeUserPassword = async (
  nickname: string,
  passwordData: PasswordChangeRequest
): Promise<void> => {
  await apiClient.put<ApiResponse>(
    API_ENDPOINTS.USER_PASSWORD_CHANGE(nickname),
    passwordData
  );
}; 