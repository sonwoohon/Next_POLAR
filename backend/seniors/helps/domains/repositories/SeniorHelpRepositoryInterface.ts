import { UpdateHelpRequestWithHelpId } from '@/backend/seniors/helps/SeniorHelpModel';
import { SeniorHelp } from '@/backend/seniors/helps/domains/entities/SeniorHelp';

export interface ISeniorHelpRepositoryInterface {
  createHelp(help: SeniorHelp, seniorId: string): Promise<number>; // 생성된 help의 id 반환
  updateHelp(help: UpdateHelpRequestWithHelpId): Promise<number>; // 성공 여부 반환
  deleteHelp(id: number): Promise<boolean>; // 성공 여부 반환
}

export interface ISeniorHelpStatusRepository {
  createVerificationCode(
    helpId: number,
    code: number,
    expiresAt: number
  ): Promise<void>;
}
