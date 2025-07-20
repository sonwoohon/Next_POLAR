import { SignUpDto } from '@/backend/users/signup/applications/dtos/SignUpDto';

export interface SignUpRepositoryInterface {
  // 회원가입
  signUp(user: SignUpDto): Promise<SignUpDto | null>;
}
