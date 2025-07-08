// ===== 요청 DTOs =====

// 로그인된 사용자 정보 수정 요청 DTO
export interface UserUpdateRequestDto {
  name?: string;
  email?: string;
  phoneNumber?: string;
  age?: number;
  profileImgUrl?: string; // 이미지 URL을 직접 입력 (http/https로 시작하는 URL)
  address?: string;
  password?: string;
}

// ===== 응답 DTOs =====

// 로그인된 사용자 정보 응답 DTO
export interface UserProfileResponseDto {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  age: number;
  profileImgUrl: string;
  address: string;
  createdAt: string;
} 