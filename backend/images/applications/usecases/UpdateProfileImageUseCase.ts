import { CommonUserEntity } from '@/backend/users/user/domains/entities/CommonUserEntity';
import { SbUserRepository } from '@/backend/users/user/infrastructures/repositories/SbUserRepository';

/**
 * 사용자의 프로필 이미지 URL을 업데이트하는 UseCase
 */
export class UpdateProfileImageUseCase {
  private userRepository: SbUserRepository;

  constructor() {
    this.userRepository = new SbUserRepository();
  }

  /**
   * 사용자의 프로필 이미지 URL을 업데이트
   * @param userId - 사용자 ID (UUID string)
   * @param imageUrl - 새로운 이미지 URL (삭제 시 빈 문자열)
   * @returns 업데이트된 사용자 정보
   */
  async execute(
    userId: string,
    imageUrl: string
  ): Promise<CommonUserEntity | null> {
    try {
      // 기존 사용자 정보 조회
      const existingUser = await this.userRepository.getUserById(userId);
      if (!existingUser) {
        console.error(`[UseCase] 사용자를 찾을 수 없음 - ID: ${userId}`);
        return null;
      }

      // 프로필 이미지 URL 업데이트
      const updatedUser = new CommonUserEntity(
        existingUser.id,
        existingUser.phoneNumber,
        existingUser.password,
        existingUser.email,
        existingUser.age,
        imageUrl, // 새로운 이미지 URL로 업데이트
        existingUser.address,
        existingUser.name,
        existingUser.nickname,
        existingUser.createdAt
      );

      // 사용자 정보 업데이트
      const result = await this.userRepository.updateUser(userId, updatedUser);
      if (!result) {
        console.error(`[UseCase] 프로필 이미지 업데이트 실패 - ID: ${userId}`);
        return null;
      }

      return result;
    } catch (error) {
      console.error(
        `[UseCase] 프로필 이미지 업데이트 중 오류 발생 - ID: ${userId}`,
        error
      );
      return null;
    }
  }
}
