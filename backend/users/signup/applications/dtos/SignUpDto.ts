export interface SignUpDto {
  uuid: string;
  name: string;
  phone_number: string;
  password: string;
  email?: string;
  age?: number;
  profile_img_url?: string;
  address?: string;
} 