// ===== 요청 DTOs =====

// 사용자 정보 수정 요청 DTO
export interface UserUpdateRequestDto {
  name?: string;
  email?: string;
  phone_number?: string;
  age?: number;
  profile_img_url?: string;
  address?: string;
}

// ===== 응답 DTOs =====

// 사용자 응답 DTO
export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  age: number;
  profile_img_url: string;
  address: string;
  created_at: string;
} 