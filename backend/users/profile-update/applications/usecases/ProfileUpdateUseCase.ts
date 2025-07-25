import { CommonUserEntity } from '@/backend/users/user/domains/entities/CommonUserEntity';
import { IProfileUpdateRepository } from '@/backend/users/profile-update/domains/repositories/IProfileUpdateRepository';

/**
 * 프로필 정보 업데이트 UseCase
 */
export class ProfileUpdateUseCase {
  constructor(
    private readonly profileUpdateRepository: IProfileUpdateRepository
  ) {}

  /**
   * 프로필 정보 업데이트
   * @param userId - 사용자 ID
   * @param profileData - 업데이트할 프로필 데이터
   * @returns 업데이트된 사용자 정보
   */
  async execute(
    userId: string,
    profileData: Partial<{
      name: string;
      address: string;
      profileImgUrl: string;
    }>
  ): Promise<CommonUserEntity | null> {
    try {
      // 기존 사용자 정보 조회 (업데이트 전 검증용)
      const existingUser = await this.profileUpdateRepository.getUserById(
        userId
      );
      if (!existingUser) {
        console.error(`[UseCase] 사용자를 찾을 수 없음 - ID: ${userId}`);
        return null;
      }

      // 프로필 정보 업데이트
      const updatedUser = await this.profileUpdateRepository.updateProfile(
        userId,
        profileData
      );
      if (!updatedUser) {
        console.error(`[UseCase] 프로필 업데이트 실패 - ID: ${userId}`);
        return null;
      }

      return updatedUser;
    } catch (error) {
      console.error(
        `[UseCase] 프로필 업데이트 중 오류 발생 - ID: ${userId}`,
        error
      );
      return null;
    }
  }
}

/**
 * 프로필 이미지 업데이트 UseCase
 */
export class ProfileImageUpdateUseCase {
  constructor(
    private readonly profileUpdateRepository: IProfileUpdateRepository
  ) {}

  /**
   * 프로필 이미지 업데이트
   * @param userId - 사용자 ID
   * @param imageFile - 업로드할 이미지 파일
   * @returns 업데이트된 프로필 이미지 URL
   */
  async execute(
    userId: string,
    imageFile: File
  ): Promise<{ profileImgUrl: string } | null> {
    try {
      // 기존 사용자 정보 조회 (업데이트 전 검증용)
      const existingUser = await this.profileUpdateRepository.getUserById(
        userId
      );
      if (!existingUser) {
        console.error(`[UseCase] 사용자를 찾을 수 없음 - ID: ${userId}`);
        return null;
      }

      // 이미지 파일 유효성 검사
      if (!imageFile || imageFile.size === 0) {
        console.error(`[UseCase] 유효하지 않은 이미지 파일 - ID: ${userId}`);
        return null;
      }

      // 지원하는 이미지 형식 검사
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];
      if (!allowedTypes.includes(imageFile.type)) {
        console.error(
          `[UseCase] 지원하지 않는 이미지 형식 - ID: ${userId}, type: ${imageFile.type}`
        );
        return null;
      }

      // 파일 크기 검사 (5MB 제한)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > maxSize) {
        console.error(
          `[UseCase] 이미지 파일 크기 초과 - ID: ${userId}, size: ${imageFile.size}`
        );
        return null;
      }

      // 프로필 이미지 업데이트
      const result = await this.profileUpdateRepository.updateProfileImage(
        userId,
        imageFile
      );
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

/**
 * 비밀번호 변경 UseCase
 */
export class PasswordChangeUseCase {
  constructor(
    private readonly profileUpdateRepository: IProfileUpdateRepository
  ) {}

  /**
   * 비밀번호 변경
   * @param userId - 사용자 ID
   * @param currentPassword - 현재 비밀번호
   * @param newPassword - 새 비밀번호
   * @returns 업데이트된 사용자 정보
   */
  async execute(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<CommonUserEntity | null> {
    try {
      // 기존 사용자 정보 조회
      const existingUser = await this.profileUpdateRepository.getUserById(
        userId
      );
      if (!existingUser) {
        console.error(`[UseCase] 사용자를 찾을 수 없음 - ID: ${userId}`);
        return null;
      }

      // 현재 비밀번호 확인
      const isCurrentPasswordValid =
        await this.profileUpdateRepository.verifyCurrentPassword(
          userId,
          currentPassword
        );

      if (!isCurrentPasswordValid) {
        console.error(
          `[UseCase] 현재 비밀번호가 일치하지 않음 - ID: ${userId}`
        );
        return null;
      }

      // 새 비밀번호 유효성 검사
      if (!newPassword || newPassword.length < 6) {
        console.error(`[UseCase] 새 비밀번호가 유효하지 않음 - ID: ${userId}`);
        return null;
      }

      // 새 비밀번호가 현재 비밀번호와 다른지 확인
      if (currentPassword === newPassword) {
        console.error(
          `[UseCase] 새 비밀번호가 현재 비밀번호와 동일함 - ID: ${userId}`
        );
        return null;
      }

      // 비밀번호 해시화 (실제 구현에서는 bcrypt 등 사용)
      const hashedNewPassword = newPassword; // TODO: 실제 해시화 로직 적용

      // 비밀번호 변경
      const updatedUser = await this.profileUpdateRepository.updatePassword(
        userId,
        hashedNewPassword
      );
      if (!updatedUser) {
        console.error(`[UseCase] 비밀번호 변경 실패 - ID: ${userId}`);
        return null;
      }

      return updatedUser;
    } catch (error) {
      console.error(
        `[UseCase] 비밀번호 변경 중 오류 발생 - ID: ${userId}`,
        error
      );
      return null;
    }
  }
}

/**
 * 사용자 정보 조회 UseCase
 */
export class GetUserProfileUseCase {
  constructor(
    private readonly profileUpdateRepository: IProfileUpdateRepository
  ) {}

  /**
   * 사용자 프로필 정보 조회
   * @param userId - 사용자 ID
   * @returns 사용자 정보
   */
  async execute(userId: string): Promise<CommonUserEntity | null> {
    try {
      const user = await this.profileUpdateRepository.getUserById(userId);
      if (!user) {
        console.error(`[UseCase] 사용자를 찾을 수 없음 - ID: ${userId}`);
        return null;
      }

      return user;
    } catch (error) {
      console.error(
        `[UseCase] 사용자 프로필 조회 중 오류 발생 - ID: ${userId}`,
        error
      );
      return null;
    }
  }
}
