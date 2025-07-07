// 회원 정보 조회 및 수정 UseCase
import { AuthRepository } from '../../domains/repositories/AuthRepository';

// 모든 사용자 조회 UseCase
export class GetAllUsersUseCase {
  async execute(): Promise<any[]> {
    return await AuthRepository.getAllUsers();
  }
}

// 특정 사용자 조회 UseCase
export class GetUserByIdUseCase {
  async execute(id: number): Promise<any | null> {
    return await AuthRepository.getUserById(id);
  }
}

// 회원 정보 수정 UseCase
export class UpdateUserInfoUseCase {
  async execute(id: number, updateData: any): Promise<any | null> {
    return await AuthRepository.updateUser(id, updateData);
  }
}
