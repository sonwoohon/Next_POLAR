import { SignUpRepositoryInterface } from '@/backend/users/signup/domains/repositories/SignUpRepositoryInterface';
import { SignUpDto } from '@/app/api/user/signup/route';

export class SignUpUsecase {
  private repository: SignUpRepositoryInterface;

  constructor(repository: SignUpRepositoryInterface) {
    this.repository = repository;
  }

  async execute(dto: SignUpDto) {
    //여기에 비즈니스 로직 구현
    return await this.repository.signUp(dto);
  }
}
