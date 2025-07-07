import { SbAuthRepository } from '../../infrastructures/repositories/SbAuthRepository';

export class AuthRepository {
  // 모든 사용자 조회
  static getAllUsers(): Promise<any[]> {
    const sbAuthRepository = new SbAuthRepository();
    return sbAuthRepository.getAllUsers();
  }

  // 특정 사용자 조회
  static getUserById(id: number): Promise<any | null> {
    const sbAuthRepository = new SbAuthRepository();
    return sbAuthRepository.getUserById(id);
  }

  // 사용자 정보 수정
  static updateUser(id: number, updateData: any): Promise<any | null> {
    const sbAuthRepository = new SbAuthRepository();
    return sbAuthRepository.updateUser(id, updateData);
  }
} 