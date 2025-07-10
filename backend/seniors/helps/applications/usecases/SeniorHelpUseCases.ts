// Senior 도움 생성, 수정, 연결, 완료, help 조건부 삭제 관련 유스케이스
// 이 파일에는 Senior 사용자의 도움 생성, 수정, 연결, 완료, help 조건부 삭제 관련 비즈니스 로직이 구현됩니다.

// 예시:
// - CreateHelpUseCase: 도움 생성
// - UpdateHelpUseCase: 도움 수정
// - ConnectHelpUseCase: 도움 연결(junior가 help에 지원하면 senior가 수락하여 연결)
// - CompleteHelpUseCase: 도움 완료(senior가 완료 버튼을 누르고, junior가 인증 코드를 입력하면 완료)
// - DeleteHelpUseCase: help 조건부 삭제

// 유스케이스는 비즈니스 로직을 구현하며, 엔티티를 조작하고 비즈니스 규칙을 적용합니다.

import { ISeniorHelpRepositoryInterface } from '@/backend/seniors/helps/domains/repositories/SeniorHelpRepositoryInteface';
import {
  CreateSeniorHelpRequestDto,
  UpdateSeniorHelpRequestDto,
} from '@/backend/seniors/helps/applications/dtos/SeniorRequest';
import {
  CreateSeniorHelpResponseDto,
  DeleteSeniorHelpResponseDto,
} from '@/backend/seniors/helps/applications/dtos/SeniorResponse';
import { SeniorHelpMapper } from '@/backend/seniors/helps/infrastructures/mappers/SeniorHelpMapper';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { UpdateHelpRequestWithHelpId } from '@/backend/seniors/helps/SeniorHelpModel';

export class SeniorHelpUseCase {
  constructor(
    private seniorHelpRepository: ISeniorHelpRepositoryInterface,
    private readonly helpRepository?: ICommonHelpRepository
  ) {}

  async createHelp(
    seniorId: number | null,
    dto: CreateSeniorHelpRequestDto
  ): Promise<CreateSeniorHelpResponseDto> {
    if (!seniorId) throw new Error('seniorId가 없습니다.');
    const entity = SeniorHelpMapper.toEntity(dto);
    const id = await this.seniorHelpRepository.createHelp(entity, seniorId);
    return { id };
  }

  async updateHelp(
    seniorId: number,
    dto: UpdateSeniorHelpRequestDto,
    helpId: number
  ) {
    if (!this.helpRepository) {
      throw new Error('helpRepository가 초기화되지 않았습니다.');
    }

    const help = await this.helpRepository?.getHelpById(helpId);
    if (!help) throw new Error('해당 help를 찾을 수 없습니다.');

    // 2. 소유자 검증
    if (help.seniorId !== seniorId) {
      throw new Error('수정 권한이 없습니다.');
    }

    // 수정
    const entity: UpdateHelpRequestWithHelpId = {
      helpId,
      title: dto.title ?? '',
      startDate: dto.startDate ?? '',
      endDate: dto.endDate,
      category: dto.category,
      content: dto.content,
    };

    const success = await this.seniorHelpRepository.updateHelp(entity);
    if (!success) throw new Error('수정 실패');

    return { success: true };
  }

  async deleteHelp(id: number): Promise<DeleteSeniorHelpResponseDto> {
    const success = await this.seniorHelpRepository.deleteHelp(id);
    return { success };
  }
}
