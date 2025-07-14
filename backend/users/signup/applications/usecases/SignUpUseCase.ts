import { SignUpRepositoryInterface } from '@/backend/users/signup/domains/repositories/SignUpRepositoryInterface';
import { SignUpDto } from '../dtos/SignUpDto';

const ADJECTIVES = [
  "귀여운", "용감한", "행복한", "슬기로운", "빠른",
  "느긋한", "신비로운", "명랑한", "우아한", "씩씩한"
];

const ANIMALS = [
  "토끼", "호랑이", "여우", "곰", "사자",
  "늑대", "다람쥐", "고양이", "강아지", "펭귄"
];


export class SignUpUsecase {
  private repository: SignUpRepositoryInterface;

  constructor(repository: SignUpRepositoryInterface) {
    this.repository = repository;
  }

  async execute(dto: SignUpDto) {
    //여기에 비즈니스 로직 구현
    dto.nickname = combineNickname(generateNickname(), generateFourDigitRandom());
    return await this.repository.signUp(dto);
  }
}


function generateFourDigitRandom() {
  return Math.floor(1000 + Math.random() * 9000);
}



function generateNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adj}${animal}`;
}

function combineNickname(nickname: string, randomNumber: number): string {
  return `${nickname}#${randomNumber}`;
}