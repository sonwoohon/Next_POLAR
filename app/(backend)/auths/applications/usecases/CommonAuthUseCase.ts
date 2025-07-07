// 회원 정보 조회 및 수정 UseCase
import { AuthRepository } from '../../domains/repositories/AuthRepository';
import { CommonAuthEntity } from '../../domains/entities/CommonAuthEntity';

// 모든 사용자 조회 UseCase
export class GetAllUsersUseCase {
  async execute(): Promise<any[]> {
    return await AuthRepository.getAllUsers();
  }
}

// 특정 사용자 조회 UseCase
export class GetUserByIdUseCase {
  async execute(id: number): Promise<any | null> {
    return await AuthRepository.getUserById(id);
  }
}

// 회원 정보 수정 UseCase
export class UpdateUserInfoUseCase {
  async execute(id: number, updateData: any): Promise<any | null> {
    return await AuthRepository.updateUser(id, updateData);
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
      throw new ValidationError('전화번호는 비어있을 수 없습니다.');
    }
    // 전화번호 형식 검증 (숫자만 허용, 하이픈 제거)
    const cleanPhoneNumber = phoneNumber.replace(/[-\s]/g, '');
    if (!/^\d+$/.test(cleanPhoneNumber)) {
      throw new ValidationError('전화번호는 숫자만 입력 가능합니다.');
    }
    if (cleanPhoneNumber.length < 10 || cleanPhoneNumber.length > 11) {
      throw new ValidationError('전화번호는 10-11자리여야 합니다.');
    }
  }

  static validatePassword(password: string): void {
    if (!password || password.length < 6) {
      throw new ValidationError('비밀번호는 최소 6자 이상이어야 합니다.');
    }
  }

  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('유효한 이메일 형식이 아닙니다.');
    }
  }

  static validateAge(age: number): void {
    if (age < 0 || age > 150) {
      throw new ValidationError('나이는 0-150 사이의 값이어야 합니다.');
    }
  }

  static validateProfileImageUrl(url: string): void {
    if (url && !url.startsWith('http')) {
      throw new ValidationError('프로필 이미지 URL은 http로 시작해야 합니다.');
    }
  }

  static validateAddress(address: string): void {
    if (!address || address.trim().length === 0) {
      throw new ValidationError('주소는 비어있을 수 없습니다.');
    }
  }

  static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('이름은 비어있을 수 없습니다.');
    }
    if (name.length > 50) {
      throw new ValidationError('이름은 50자를 초과할 수 없습니다.');
    }
  }
}

// 사용자 정보 업데이트 인터페이스
export interface UserProfileUpdate {
  phone_number?: string;
  email?: string;
  age?: number;
  profile_img_url?: string;
  address?: string;
  name?: string;
}

// 공용 인증 Use Case
export class CommonAuthUseCase {
  // 사용자 프로필 업데이트
  static updateUserProfile(user: CommonAuthEntity, updates: UserProfileUpdate): CommonAuthEntity {
    // 검증 수행
    if (updates.phone_number !== undefined) {
      UserValidator.validatePhoneNumber(updates.phone_number);
    }
    if (updates.email !== undefined) {
      UserValidator.validateEmail(updates.email);
    }
    if (updates.age !== undefined) {
      UserValidator.validateAge(updates.age);
    }
    if (updates.profile_img_url !== undefined) {
      UserValidator.validateProfileImageUrl(updates.profile_img_url);
    }
    if (updates.address !== undefined) {
      UserValidator.validateAddress(updates.address);
    }
    if (updates.name !== undefined) {
      UserValidator.validateName(updates.name);
    }

    // 새로운 엔티티 생성 (불변성 유지)
    return new CommonAuthEntity(
      user.id,
      updates.phone_number ?? user.phone_number,
      user.password, // 비밀번호는 별도 메서드로 변경
      updates.email ?? user.email,
      updates.age ?? user.age,
      updates.profile_img_url ?? user.profile_img_url,
      updates.address ?? user.address,
      updates.name ?? user.name,
      user.created_at
    );
  }

  // 비밀번호 변경
  static changePassword(user: CommonAuthEntity, newPassword: string): CommonAuthEntity {
    UserValidator.validatePassword(newPassword);
    
    return new CommonAuthEntity(
      user.id,
      user.phone_number,
      newPassword,
      user.email,
      user.age,
      user.profile_img_url,
      user.address,
      user.name,
      user.created_at
    );
  }
}
