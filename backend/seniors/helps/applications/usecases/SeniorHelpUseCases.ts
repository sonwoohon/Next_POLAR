import { ISeniorHelpRepositoryInterface } from '../../domains/repositories/SeniorHelpRepositoryInterface';
import {
  CreateSeniorHelpRequestDto,
  UpdateSeniorHelpRequestDto,
} from '../dtos/SeniorRequest';
import {
  CreateSeniorHelpResponseDto,
  DeleteSeniorHelpResponseDto,
} from '../dtos/SeniorResponse';
import { SeniorHelpMapper } from '../../infrastructures/mappers/SeniorHelpMapper';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { UpdateHelpRequestWithHelpId } from '../../SeniorHelpModel';

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

    if (help.seniorId !== seniorId) {
      throw new Error('수정 권한이 없습니다.');
    }

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
