import { CommonUserEntity } from '@/backend/uesrs/domains/entities/CommonUserEntity';
import { SbUserRepository } from '@/backend/uesrs/infrastructures/repositories/SbUserRepository';

/**
 * 사용자의 프로필 이미지 URL을 업데이트하는 공통 함수
 * @param user - 현재 사용자 정보
 * @param userId - 사용자 ID
 * @param newImageUrl - 새로운 이미지 URL (삭제 시 빈 문자열)
 * @returns 업데이트된 사용자 정보
 */
export async function updateUserProfileImage(user: any, userId: number, newImageUrl: string) {
  const updatedUser = new CommonUserEntity(
    user.id,
    user.phoneNumber,
    user.password,
    user.email,
    Number(user.age), // age를 명시적으로 number로 변환
    newImageUrl,
    user.address,
    user.name,
    user.createdAt
  );
  
  const userRepository = new SbUserRepository();
  return await userRepository.updateUser(userId, updatedUser);
} 