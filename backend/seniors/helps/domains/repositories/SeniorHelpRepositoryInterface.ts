import { UpdateHelpRequestWithHelpId } from '@/backend/seniors/helps/SeniorHelpModel';
import { SeniorHelp } from '@/backend/seniors/helps/domains/entities/SeniorHelp';
import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';

export interface ISeniorHelpRepositoryInterface {
  createHelp(help: SeniorHelp, seniorId: string): Promise<number>; // 생성된 help의 id 반환
  updateHelp(help: UpdateHelpRequestWithHelpId): Promise<number>; // 성공 여부 반환
  deleteHelp(id: number): Promise<boolean>; // 성공 여부 반환
  getHelpsBySeniorNickname(seniorNickname: string): Promise<CommonHelpEntity[] | null>; // 시니어가 작성한 헬프 리스트 조회
}

export interface ISeniorHelpStatusRepository {
  createVerificationCode(
    helpId: number,
    code: number,
    expiresAt: number
  ): Promise<void>;
}
