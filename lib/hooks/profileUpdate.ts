import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserProfileForUpdate,
  updateUserProfile,
  updateUserProfileImage,
  changeUserPassword,
  ProfileUpdateRequest,
  PasswordChangeRequest,
} from '../api_front/profileUpdate.api';
import { QUERY_KEYS } from '../constants/api';
import { UserProfileResponseDto } from '@/backend/common/dtos/UserDto';

// 프로필 정보 조회 훅
export const useUserProfileForUpdate = (nickname: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE_UPDATE(nickname),
    queryFn: () => getUserProfileForUpdate(nickname),
    enabled: !!nickname,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// 프로필 정보 업데이트 훅
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nickname, profileData }: { nickname: string; profileData: ProfileUpdateRequest }) =>
      updateUserProfile(nickname, profileData),
    onSuccess: (data, { nickname }) => {
      // 프로필 업데이트 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_PROFILE_UPDATE(nickname),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_PROFILE(nickname),
      });

      // 캐시 업데이트
      queryClient.setQueryData(
        QUERY_KEYS.USER_PROFILE_UPDATE(nickname),
        data
      );
      queryClient.setQueryData(
        QUERY_KEYS.USER_PROFILE(nickname),
        data
      );
    },
    onError: (error) => {
      console.error('프로필 업데이트 실패:', error);
    },
  });
};

// 프로필 이미지 업데이트 훅
export const useUpdateUserProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nickname, imageFile }: { nickname: string; imageFile: File }) =>
      updateUserProfileImage(nickname, imageFile),
    onSuccess: (data, { nickname }) => {
      // 프로필 업데이트 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_PROFILE_UPDATE(nickname),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_PROFILE(nickname),
      });

      // 기존 프로필 데이터에 이미지 URL 업데이트
      queryClient.setQueryData<UserProfileResponseDto>(
        QUERY_KEYS.USER_PROFILE_UPDATE(nickname),
        (oldData) => {
          if (oldData) {
            return {
              ...oldData,
              profileImgUrl: data.profileImgUrl,
            };
          }
          return oldData;
        }
      );

      queryClient.setQueryData<UserProfileResponseDto>(
        QUERY_KEYS.USER_PROFILE(nickname),
        (oldData) => {
          if (oldData) {
            return {
              ...oldData,
              profileImgUrl: data.profileImgUrl,
            };
          }
          return oldData;
        }
      );
    },
    onError: (error) => {
      console.error('프로필 이미지 업데이트 실패:', error);
    },
  });
};

// 비밀번호 변경 훅
export const useChangeUserPassword = () => {
  return useMutation({
    mutationFn: ({ nickname, passwordData }: { nickname: string; passwordData: PasswordChangeRequest }) =>
      changeUserPassword(nickname, passwordData),
    onSuccess: () => {
      // 비밀번호 변경은 다른 데이터에 영향을 주지 않으므로 캐시 무효화 없음
      console.log('비밀번호 변경 성공');
    },
    onError: (error) => {
      console.error('비밀번호 변경 실패:', error);
    },
  });
}; 