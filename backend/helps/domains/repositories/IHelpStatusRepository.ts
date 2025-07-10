<<<<<<< HEAD
import { HelpStatus } from '@/backend/helps/domains/entities/HelpStatus';

// Help 상태 관리 리포지토리 인터페이스 (공통)
export interface IHelpStatusRepository {
  // 상태 관리
  updateHelpStatus(helpId: number, status: HelpStatus): Promise<boolean>;
  getHelpStatus(helpId: number): Promise<HelpStatus | null>;
}
=======
// 이 파일은 backend/common/repositories/IHelpStatusRepository.ts로 이동되었습니다.
// import { IHelpStatusRepository } from '@/backend/common/repositories/IHelpStatusRepository'; 를 사용하세요.
>>>>>>> 714e74345bf047750ce28a37052b6141b2547621
