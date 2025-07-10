import { ValidationError } from '@/backend/common/errors/ValidationError';

// 공용 사용자 정보 검증 클래스
export class UserValidator {
  static validatePhoneNumber(phoneNumber: string): void {
    console.log(`[Validator] 전화번호 검증 시작: ${phoneNumber}`);

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

    console.log(`[Validator] 전화번호 검증 성공: ${cleanPhoneNumber}`);
  }

  static validatePassword(password: string): void {
    console.log(`[Validator] 비밀번호 검증 시작: 길이 ${password.length}`);

    if (!password || password.length < 6) {
      console.error(
        `[Validator] 비밀번호 검증 실패: 길이 부족 - ${password.length}자리`
      );
      throw new ValidationError('비밀번호는 최소 6자 이상이어야 합니다.');
    }

    console.log('[Validator] 비밀번호 검증 성공');
  }

  static validateEmail(email: string): void {
    console.log(`[Validator] 이메일 검증 시작: ${email}`);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error(`[Validator] 이메일 검증 실패: 형식 오류 - ${email}`);
      throw new ValidationError('유효한 이메일 형식이 아닙니다.');
    }

    console.log(`[Validator] 이메일 검증 성공: ${email}`);
  }

  static validateAge(age: number): void {
    console.log(`[Validator] 나이 검증 시작: ${age}`);

    if (age < 0 || age > 150) {
      console.error(`[Validator] 나이 검증 실패: 범위 오류 - ${age}`);
      throw new ValidationError('나이는 0-150 사이의 값이어야 합니다.');
    }

    console.log(`[Validator] 나이 검증 성공: ${age}`);
  }

  static validateProfileImageUrl(url: string): void {
    console.log(`[Validator] 프로필 이미지 URL 검증 시작: ${url}`);

    if (url && !url.startsWith('http') && !url.startsWith('https')) {
      console.error(
        `[Validator] 프로필 이미지 URL 검증 실패: 프로토콜 오류 - ${url}`
      );
      throw new ValidationError(
        '프로필 이미지 URL은 http 또는 https로 시작해야 합니다.'
      );
    }

    console.log(`[Validator] 프로필 이미지 URL 검증 성공: ${url}`);
  }

  static validateAddress(address: string): void {
    console.log(`[Validator] 주소 검증 시작: ${address}`);

    if (!address || address.trim().length === 0) {
      console.error('[Validator] 주소 검증 실패: 빈 값');
      throw new ValidationError('주소는 비어있을 수 없습니다.');
    }

    console.log(`[Validator] 주소 검증 성공: ${address}`);
  }

  static validateName(name: string): void {
    console.log(`[Validator] 이름 검증 시작: ${name}`);

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

    console.log(`[Validator] 이름 검증 성공: ${name}`);
  }
}
