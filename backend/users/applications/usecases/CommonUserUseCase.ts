// 회원 정보 조회 및 수정 UseCase
import { CommonUserEntity as UserEntity } from '@/backend/common/entities/UserEntity';
import { IUserRepository } from '@/backend/common/repositories/IUserRepository';
import { ValidationError } from '@/backend/common/errors/ValidationError';
import { UserValidator } from '@/backend/common/validators/UserValidator';
import { UserProfileUpdate } from '@/backend/common/dtos/UserDto';

// 특정 사용자 조회 UseCase
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<UserEntity | null> {
    return this.userRepository.getUserById(id);
  }
}

// 회원 정보 수정 UseCase
export class UpdateUserInfoUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    id: number,
    updateData: UserProfileUpdate
  ): Promise<UserEntity | null> {
    return this.userRepository.updateUser(id, updateData);
  }
}

// 공용 사용자 Use Case
export class CommonUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  // 특정 사용자 조회
  async getUserById(id: number): Promise<UserEntity | null> {
    console.log(`[UseCase] 사용자 조회 시작 - ID: ${id}`);

    try {
      const user = await this.userRepository.getUserById(id);

      if (user) {
        console.log(`[UseCase] 사용자 조회 성공 - ID: ${id}`, user.toJSON());
      } else {
        console.log(`[UseCase] 사용자를 찾을 수 없음 - ID: ${id}`);
      }

      return user;
    } catch (error) {
      console.error(`[UseCase] 사용자 조회 중 오류 발생 - ID: ${id}`, error);
      throw error;
    }
  }

  // 프로필 이미지 삭제 (빈 프로필로 설정)
  async deleteProfileImage(id: number): Promise<UserEntity> {
    console.log(`[UseCase] 프로필 이미지 삭제 시작 - ID: ${id}`);

    try {
      const existingUser = await this.userRepository.getUserById(id);
      if (!existingUser) {
        console.error(
          `[UseCase] 프로필 이미지 삭제 실패 - 사용자를 찾을 수 없음 - ID: ${id}`
        );
        throw new ValidationError('사용자를 찾을 수 없습니다.');
      }

      console.log(
        `[UseCase] 기존 사용자 정보 - ID: ${id}`,
        existingUser.toJSON()
      );

      // 프로필 이미지 URL을 빈 문자열로 설정
      const updatedUser = new UserEntity(
        existingUser.id,
        existingUser.phoneNumber,
        existingUser.password,
        existingUser.email,
        existingUser.age,
        '', // 빈 문자열로 설정
        existingUser.address,
        existingUser.name,
        existingUser.createdAt
      );

      console.log(
        `[UseCase] 업데이트할 사용자 정보 - ID: ${id}`,
        updatedUser.toJSON()
      );

      const result = await this.userRepository.updateUser(id, updatedUser);
      if (!result) {
        console.error(
          `[UseCase] 프로필 이미지 삭제 실패 - 업데이트 실패 - ID: ${id}`
        );
        throw new ValidationError('프로필 이미지 삭제에 실패했습니다.');
      }

      console.log(
        `[UseCase] 프로필 이미지 삭제 성공 - ID: ${id}`,
        result.toJSON()
      );
      return result;
    } catch (error) {
      console.error(
        `[UseCase] 프로필 이미지 삭제 중 오류 발생 - ID: ${id}`,
        error
      );
      throw error;
    }
  }

  // 사용자 프로필 업데이트
  async updateUserProfile(
    id: number,
    updates: UserProfileUpdate
  ): Promise<UserEntity> {
    console.log(`[UseCase] 사용자 프로필 업데이트 시작 - ID: ${id}`, updates);

    try {
      // 기존 사용자 정보 조회
      const existingUser = await this.userRepository.getUserById(id);
      if (!existingUser) {
        console.error(
          `[UseCase] 사용자 프로필 업데이트 실패 - 사용자를 찾을 수 없음 - ID: ${id}`
        );
        throw new ValidationError('사용자를 찾을 수 없습니다.');
      }

      console.log(
        `[UseCase] 기존 사용자 정보 - ID: ${id}`,
        existingUser.toJSON()
      );

      // 업데이트할 필드 검증
      if (updates.phoneNumber) {
        UserValidator.validatePhoneNumber(updates.phoneNumber);
      }
      if (updates.email) {
        UserValidator.validateEmail(updates.email);
      }
      if (updates.age) {
        UserValidator.validateAge(updates.age);
      }
      if (updates.profileImgUrl) {
        UserValidator.validateProfileImageUrl(updates.profileImgUrl);
      }
      if (updates.address) {
        UserValidator.validateAddress(updates.address);
      }
      if (updates.name) {
        UserValidator.validateName(updates.name);
      }
      if (updates.password) {
        UserValidator.validatePassword(updates.password);
      }

      // 업데이트된 사용자 엔티티 생성
      const updatedUser = new UserEntity(
        existingUser.id,
        updates.phoneNumber || existingUser.phoneNumber,
        updates.password || existingUser.password,
        updates.email || existingUser.email,
        updates.age || existingUser.age,
        updates.profileImgUrl || existingUser.profileImgUrl,
        updates.address || existingUser.address,
        updates.name || existingUser.name,
        existingUser.createdAt
      );

      console.log(
        `[UseCase] 업데이트할 사용자 정보 - ID: ${id}`,
        updatedUser.toJSON()
      );

      // 사용자 정보 업데이트
      const result = await this.userRepository.updateUser(id, updatedUser);
      if (!result) {
        console.error(
          `[UseCase] 사용자 프로필 업데이트 실패 - 업데이트 실패 - ID: ${id}`
        );
        throw new ValidationError('사용자 정보 업데이트에 실패했습니다.');
      }

      console.log(
        `[UseCase] 사용자 프로필 업데이트 성공 - ID: ${id}`,
        result.toJSON()
      );
      return result;
    } catch (error) {
      console.error(
        `[UseCase] 사용자 프로필 업데이트 중 오류 발생 - ID: ${id}`,
        error
      );
      throw error;
    }
  }
}
