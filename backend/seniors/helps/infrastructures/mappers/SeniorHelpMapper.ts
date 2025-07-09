import { SeniorHelp } from '../../domains/entities/SeniorHelp';
import { CreateSeniorHelpRequestDto } from '../../applications/dtos/SeniorRequest';

export class SeniorHelpMapper {
  static toEntity(dto: CreateSeniorHelpRequestDto): SeniorHelp {
    return new SeniorHelp(
      dto.title,
      dto.startDate,
      dto.content ?? '',
      dto.category,
      dto.endDate
    );
  }
}
