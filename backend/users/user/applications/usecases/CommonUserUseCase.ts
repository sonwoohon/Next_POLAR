// 회원 정보 조회 및 수정 UseCase
import { CommonUserEntity } from '@/backend/users/user/domains/entities/CommonUserEntity';
import { IUserRepository } from '@/backend/common/repositories/IUserRepository';

// 특정 사용자 조회 UseCase
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<CommonUserEntity | null> {
    return this.userRepository.getUserById(id);
  }
}

// 회원 정보 수정 UseCase
export class UpdateUserInfoUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    id: string,
    updateData: CommonUserEntity
  ): Promise<CommonUserEntity | null> {
    return this.userRepository.updateUser(id, updateData);
  }
}

// 검증 에러 클래스
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// 사용자 정보 검증 클래스
export class UserValidator {
  static validatePhoneNumber(phoneNumber: string): void {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      console.error('[Validator] 전화번호 검증 실패: 빈 값');
      throw new ValidationError('전화번호는 비어있을 수 없습니다.');
    }
    // 전화번호 형식 검증 (숫자만 허용, 하이픈 제거)
    const cleanPhoneNumber = phoneNumber.replace(/[-\s]/g, '');
    if (!/^\d+$/.test(cleanPhoneNumber)) {
      console.error(
        `[Validator] 전화번호 검증 실패: 숫자가 아닌 문자 포함 - ${phoneNumber}`
      );
      throw new ValidationError('전화번호는 숫자만 입력 가능합니다.');
    }
    if (cleanPhoneNumber.length < 10 || cleanPhoneNumber.length > 11) {
      console.error(
        `[Validator] 전화번호 검증 실패: 길이 오류 - ${cleanPhoneNumber.length}자리`
      );
      throw new ValidationError('전화번호는 10-11자리여야 합니다.');
    }
  }

  static validatePassword(password: string): void {
    if (!password || password.length < 6) {
      console.error(
        `[Validator] 비밀번호 검증 실패: 길이 부족 - ${password.length}자리`
      );
      throw new ValidationError('비밀번호는 최소 6자 이상이어야 합니다.');
    }
  }

  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error(`[Validator] 이메일 검증 실패: 형식 오류 - ${email}`);
      throw new ValidationError('유효한 이메일 형식이 아닙니다.');
    }
  }

  static validateAge(age: number): void {
    if (age < 0 || age > 150) {
      console.error(`[Validator] 나이 검증 실패: 범위 오류 - ${age}`);
      throw new ValidationError('나이는 0-150 사이의 값이어야 합니다.');
    }
  }

  static validateProfileImageUrl(url: string): void {
    // 빈 URL은 허용 (프로필 이미지가 없는 경우)
    if (!url || url.trim() === '') {
      return;
    }

    // Supabase Storage URL 형식 확인
    if (url && !url.startsWith('http') && !url.startsWith('https')) {
      console.error(
        `[Validator] 프로필 이미지 URL 검증 실패: 프로토콜 오류 - ${url}`
      );
      throw new ValidationError(
        '프로필 이미지 URL은 http 또는 https로 시작해야 합니다.'
      );
    }
  }

  static validateAddress(address: string): void {
    if (!address || address.trim().length === 0) {
      console.error('[Validator] 주소 검증 실패: 빈 값');
      throw new ValidationError('주소는 비어있을 수 없습니다.');
    }
  }

  static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      console.error('[Validator] 이름 검증 실패: 빈 값');
      throw new ValidationError('이름은 비어있을 수 없습니다.');
    }
    if (name.length > 50) {
      console.error(
        `[Validator] 이름 검증 실패: 길이 초과 - ${name.length}자리`
      );
      throw new ValidationError('이름은 50자를 초과할 수 없습니다.');
    }
  }

  static validateNickname(nickname: string): void {
    if (!nickname || nickname.trim().length === 0) {
      console.error('[Validator] 닉네임 검증 실패: 빈 값');
      throw new ValidationError('닉네임은 비어있을 수 없습니다.');
    }
    if (nickname.length > 30) {
      console.error(
        `[Validator] 닉네임 검증 실패: 길이 초과 - ${nickname.length}자리`
      );
      throw new ValidationError('닉네임은 30자를 초과할 수 없습니다.');
    }
  }
}

// 사용자 정보 업데이트 인터페이스 (비밀번호 포함)
export interface UserProfileUpdate {
  phoneNumber?: string;
  email?: string;
  age?: number;
  profile_img_url?: string;
  address?: string;
  name?: string;
  nickname?: string;
  password?: string;
}

// 공용 사용자 Use Case
export class CommonUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  // 특정 사용자 조회
  async getUserById(id: string): Promise<CommonUserEntity | null> {
    try {
      const user = await this.userRepository.getUserById(id);

      if (user) {
      } else {
      }

      return user;
    } catch (error) {
      console.error(`[UseCase] 사용자 조회 중 오류 발생 - ID: ${id}`, error);
      throw error;
    }
  }

  // nickname으로 사용자 조회
  async getUserByNickname(nickname: string): Promise<CommonUserEntity | null> {
    try {
      const user = await this.userRepository.getUserByNickname(nickname);

      if (user) {
      } else {
      }

      return user;
    } catch (error) {
      console.error(
        `[UseCase] 사용자 조회 중 오류 발생 - nickname: ${nickname}`,
        error
      );
      throw error;
    }
  }

  // 프로필 이미지 삭제 (빈 프로필로 설정)
  async deleteProfileImage(id: string): Promise<CommonUserEntity> {
    try {
      const existingUser = await this.userRepository.getUserById(id);
      if (!existingUser) {
        console.error(
          `[UseCase] 프로필 이미지 삭제 실패 - 사용자를 찾을 수 없음 - ID: ${id}`
        );
        throw new ValidationError('사용자를 찾을 수 없습니다.');
      }

      // 프로필 이미지 URL을 빈 문자열로 설정
      const updatedUser = new CommonUserEntity(
        existingUser.id,
        existingUser.phoneNumber,
        existingUser.password,
        existingUser.email,
        existingUser.age,
        '', // 빈 문자열로 설정
        existingUser.address,
        existingUser.name,
        existingUser.nickname,
        existingUser.createdAt
      );

      const result = await this.userRepository.updateUser(id, updatedUser);
      if (!result) {
        console.error(
          `[UseCase] 프로필 이미지 삭제 실패 - Repository 업데이트 실패 - ID: ${id}`
        );
        throw new ValidationError('프로필 이미지 삭제에 실패했습니다.');
      }

      return result;
    } catch (error) {
      console.error(
        `[UseCase] 프로필 이미지 삭제 중 오류 발생 - ID: ${id}`,
        error
      );
      throw error;
    }
  }

  // 사용자 프로필 업데이트 (비밀번호 포함)
  async updateUserProfile(
    id: string,
    updates: UserProfileUpdate
  ): Promise<CommonUserEntity> {
    try {
      // 기존 사용자 조회
      const existingUser = await this.userRepository.getUserById(id);
      if (!existingUser) {
        console.error(
          `[UseCase] 프로필 업데이트 실패 - 사용자를 찾을 수 없음 - ID: ${id}`
        );
        throw new ValidationError('사용자를 찾을 수 없습니다.');
      }

      // 업데이트할 필드 검증
      if (updates.phoneNumber) {
        UserValidator.validatePhoneNumber(updates.phoneNumber);
      }
      if (updates.email) {
        UserValidator.validateEmail(updates.email);
      }
      if (updates.age !== undefined) {
        UserValidator.validateAge(updates.age);
      }
      if (updates.profile_img_url) {
        UserValidator.validateProfileImageUrl(updates.profile_img_url);
      }
      if (updates.address) {
        UserValidator.validateAddress(updates.address);
      }
      if (updates.name) {
        UserValidator.validateName(updates.name);
      }
      if (updates.nickname !== undefined) {
        UserValidator.validateNickname(updates.nickname);
      }
      if (updates.password !== undefined) {
        UserValidator.validatePassword(updates.password);
      }

      // 업데이트된 사용자 Entity 생성
      const updatedUser = new CommonUserEntity(
        existingUser.id,
        updates.phoneNumber ?? existingUser.phoneNumber,
        updates.password ?? existingUser.password,
        updates.email ?? existingUser.email,
        updates.age ?? existingUser.age,
        updates.profile_img_url ?? existingUser.profileImgUrl,
        updates.address ?? existingUser.address,
        updates.name ?? existingUser.name,
        updates.nickname ?? existingUser.nickname,
        existingUser.createdAt
      );

      // Repository를 통해 업데이트
      const result = await this.userRepository.updateUser(id, updatedUser);
      if (!result) {
        console.error(
          `[UseCase] 프로필 업데이트 실패 - Repository 업데이트 실패 - ID: ${id}`
        );
        throw new ValidationError('프로필 업데이트에 실패했습니다.');
      }

      return result;
    } catch (error) {
      console.error(
        `[UseCase] 프로필 업데이트 중 오류 발생 - ID: ${id}`,
        error
      );
      throw error;
    }
  }
}
