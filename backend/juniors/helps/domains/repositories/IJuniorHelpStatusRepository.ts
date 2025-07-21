import { JuniorHelpVerificationCodeEntity } from '@/backend/juniors/helps/domains/entities/JuniorHelp';
import { HelpListResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';

export interface IJuniorHelpStatusRepository {
  // 상태 관리
  getVerificationCode(
    helpId: number
  ): Promise<JuniorHelpVerificationCodeEntity>;
  deleteVerificationCode(helpId: number): Promise<boolean>;

  // 주니어가 수락된 Help 리스트 조회
  getAcceptedHelpsByJuniorId(
    juniorNickname: string,
    page: number,
    limit: number
  ): Promise<{
    helps: HelpListResponseDto[];
    totalCount: number;
  }>;
}
