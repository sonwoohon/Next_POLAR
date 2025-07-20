// ===== 요청 DTOs =====

// 프로필 정보 업데이트 요청 DTO (닉네임, 나이 제외)
export interface ProfileUpdateRequestDto {
  name?: string;
  address?: string;
  profileImage?: File; // 프로필 이미지 파일
}

// 비밀번호 변경 요청 DTO
export interface PasswordChangeRequestDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ===== 응답 DTOs =====

// 프로필 업데이트 성공 응답 DTO
export interface ProfileUpdateResponseDto {
  success: boolean;
  message: string;
  updatedUser: {
    name: string;
    nickname: string;
    profileImgUrl: string;
    address: string;
  };
}

// 비밀번호 변경 성공 응답 DTO
export interface PasswordChangeResponseDto {
  success: boolean;
  message: string;
}

// ===== 에러 응답 DTOs =====

// 프로필 업데이트 에러 응답 DTO
export interface ProfileUpdateErrorDto {
  success: false;
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
}

// 비밀번호 변경 에러 응답 DTO
export interface PasswordChangeErrorDto {
  success: false;
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
}
