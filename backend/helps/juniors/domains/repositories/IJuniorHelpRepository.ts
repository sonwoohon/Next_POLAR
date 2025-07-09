import { CommonHelpEntity } from "@/backend/helps/domains/entities/CommonHelpEntity";
export interface IJuniorHelpRepository {
  // 주니어가 지원한 헬프 목록 조회
  getJuniorAppliedHelpList(juniorId: number): Promise<CommonHelpEntity[] | null>;
  // 주니어가 헬프 지원
  applyHelp(juniorId: number, helpId: number): Promise<void | null>;
  // 주니어가 헬프 지원 취소
  cancelJuniorlHelp(juniorId: number, helpId: number): Promise<void | null>;
}