import { CommonUserEntity } from '@/backend/users/domains/entities/CommonUserEntity';
import { SbUserRepository } from '@/backend/users/infrastructures/repositories/SbUserRepository';

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
   * @param user - 현재 사용자 정보
   * @param userId - 사용자 ID
   * @param newImageUrl - 새로운 이미지 URL (삭제 시 빈 문자열)
   * @returns 업데이트된 사용자 정보
   */
  async execute(user: any, userId: number, newImageUrl: string): Promise<CommonUserEntity | null> {
    console.log(`[UseCase] 프로필 이미지 업데이트 시작 - UserID: ${userId}, NewImageUrl: ${newImageUrl}`);
    
    try {
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
      
      const result = await this.userRepository.updateUser(userId, updatedUser);
      
      if (result) {
        console.log(`[UseCase] 프로필 이미지 업데이트 성공 - UserID: ${userId}`);
      } else {
        console.error(`[UseCase] 프로필 이미지 업데이트 실패 - UserID: ${userId}`);
      }
      
      return result;
    } catch (error) {
      console.error(`[UseCase] 프로필 이미지 업데이트 중 오류 발생 - UserID: ${userId}:`, error);
      throw error;
    }
  }
} 