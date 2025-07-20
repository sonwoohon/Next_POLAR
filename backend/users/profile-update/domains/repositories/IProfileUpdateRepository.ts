import { CommonUserEntity } from '@/backend/users/user/domains/entities/CommonUserEntity';

// 프로필 업데이트 리포지토리 인터페이스
export interface IProfileUpdateRepository {
  // 프로필 정보 업데이트
  updateProfile(
    userId: string,
    profileData: Partial<{
      name: string;
      address: string;
      profileImgUrl: string;
    }>
  ): Promise<CommonUserEntity | null>;

  // 프로필 이미지 업로드 및 URL 업데이트
  updateProfileImage(
    userId: string,
    imageFile: File
  ): Promise<{ profileImgUrl: string } | null>;

  // 비밀번호 변경
  updatePassword(
    userId: string,
    hashedNewPassword: string
  ): Promise<CommonUserEntity | null>;

  // 현재 비밀번호 확인
  verifyCurrentPassword(
    userId: string,
    currentPassword: string
  ): Promise<boolean>;

  // 사용자 정보 조회 (업데이트 전 검증용)
  getUserById(userId: string): Promise<CommonUserEntity | null>;
} 