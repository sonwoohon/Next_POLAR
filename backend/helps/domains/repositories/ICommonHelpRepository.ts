import { CommonHelpEntity } from "../entities/CommonHelpEntity";

export interface ICommonHelpRepository {
  getHelpList(): Promise<CommonHelpEntity[] | null>;
  getHelpById(id: number): Promise<CommonHelpEntity | null>;
  // 헬프 생성 같은건 시니어 귀속?
}