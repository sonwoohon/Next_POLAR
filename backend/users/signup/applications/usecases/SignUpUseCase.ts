import { SignUpRepositoryInterface } from '@/backend/users/signup/domains/repositories/SignUpRepositoryInterface';
import { SignUpDto } from '@/app/api/user/signup/route';
import { v4 as uuidv4 } from 'uuid';


export class SignUpUsecase {
  private repository: SignUpRepositoryInterface;

  constructor(repository: SignUpRepositoryInterface) {
    this.repository = repository;
  }

  async execute(dto: SignUpDto) {
    //여기에 비즈니스 로직 구현

    dto.uuid = uuidv4(); // UUID v4 문자열 생성
    return await this.repository.signUp(dto);
  }
}

function generateFourDigitRandom() {
  return Math.floor(1000 + Math.random() * 9000);
}
