import {
  CommonHelpEntity,
  CommonHelpWithNicknameEntity,
} from '@/backend/helps/domains/entities/CommonHelpEntity';
import { HelpFilterDto } from '@/backend/helps/applications/dtos/HelpFilterDto';

export interface ICommonHelpRepository {
  getHelpList(): Promise<CommonHelpEntity[] | null>;
  getHelpById(id: number): Promise<CommonHelpEntity | null>;
  // nickname을 포함한 조회 메서드들
  getHelpListWithNicknames(): Promise<CommonHelpWithNicknameEntity[] | null>;
  getHelpByIdWithNickname(
    id: number
  ): Promise<CommonHelpWithNicknameEntity | null>;
  // 필터링된 헬프 리스트 조회
  getHelpListWithFilter(
    filter: HelpFilterDto
  ): Promise<CommonHelpEntity[] | null>;
  // 필터링된 헬프 개수 조회 (페이지네이션용)
  getHelpCountWithFilter(filter: HelpFilterDto): Promise<number>;
  // 헬프 생성 같은건 시니어 귀속?
}
