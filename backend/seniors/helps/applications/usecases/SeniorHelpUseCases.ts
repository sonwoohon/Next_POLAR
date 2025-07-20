import { ISeniorHelpRepositoryInterface } from '@/backend/seniors/helps/domains/repositories/SeniorHelpRepositoryInterface';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import {
  CreateSeniorHelpRequestDto,
  UpdateSeniorHelpRequestDto,
} from '@/backend/seniors/helps/applications/dtos/SeniorRequest';
import {
  CreateSeniorHelpResponseDto,
  DeleteSeniorHelpResponseDto,
} from '@/backend/seniors/helps/applications/dtos/SeniorResponse';
import { SeniorHelpMapper } from '@/backend/seniors/helps/infrastructures/mappers/SeniorHelpMapper';
import { UpdateHelpRequestWithHelpId } from '@/backend/seniors/helps/SeniorHelpModel';
import { getNicknameByUuid, getUuidByNickname } from '@/lib/getUserData';

export class SeniorHelpUseCase {
  constructor(
    private seniorHelpRepository: ISeniorHelpRepositoryInterface,
    private readonly helpRepository?: ICommonHelpRepository
  ) {}

  async createHelp(
    seniorNickname: string,
    dto: CreateSeniorHelpRequestDto
  ): Promise<CreateSeniorHelpResponseDto> {
    if (!seniorNickname) throw new Error('seniorNickname이 없습니다.');

    // nickname을 uuid로 변환
    const seniorId = await getUuidByNickname(seniorNickname);
    if (!seniorId) throw new Error('해당 nickname의 사용자를 찾을 수 없습니다.');

    const entity = SeniorHelpMapper.toEntity(dto);
    const id = await this.seniorHelpRepository.createHelp(entity, seniorId);
    return { id };
  }

  async updateHelp(
    seniorNickname: string,
    dto: UpdateSeniorHelpRequestDto,
    helpId: number
  ) {
    if (!this.helpRepository) {
      throw new Error('helpRepository가 초기화되지 않았습니다.');
    }

    // uuid 변환 없이 nickname으로 repository 호출
    const help = await this.helpRepository?.getHelpById(helpId);
    if (!help) throw new Error('해당 help를 찾을 수 없습니다.');

    // help.seniorId에서 닉네임을 가져와서 권한 확인
    const helpSeniorNickname = await getNicknameByUuid(help.seniorId);
    if (helpSeniorNickname !== seniorNickname) {
      throw new Error('수정 권한이 없습니다.');
    }

    const entity: UpdateHelpRequestWithHelpId = {
      helpId,
      title: dto.title ?? '',
      startDate: dto.startDate ?? '',
      endDate: dto.endDate,
      category: dto.category || [],
      content: dto.content,
    };

    await this.seniorHelpRepository.updateHelp(entity);
    return { success: true };
  }

  async deleteHelp(id: number): Promise<DeleteSeniorHelpResponseDto> {
    const success = await this.seniorHelpRepository.deleteHelp(id);
    return { success };
  }
}
