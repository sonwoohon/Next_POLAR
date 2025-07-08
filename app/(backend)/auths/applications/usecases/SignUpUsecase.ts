import { AuthRepositoryInterface } from "../../domains/repositories/AuthRepositoryInterface";
import { SignUpDto } from "@/app/api/auths/route";

export class SignUpUsecase {
  private repository: AuthRepositoryInterface;

  constructor(repository: AuthRepositoryInterface) {
    this.repository = repository;
  }

  async execute(dto: SignUpDto) {
    //여기에 비즈니스 로직 구현 
    return await this.repository.signUp(dto);
  }
}