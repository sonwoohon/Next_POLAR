import { JuniorHelpVerificationCodeEntity } from '@/backend/juniors/helps/domains/entities/JuniorHelp';
export class StatusMapper {
  static toJuniorHelp(data: {
    help_id: number;
    code: number;
    expires_at: number;
    created_at: Date;
  }): JuniorHelpVerificationCodeEntity {
    return new JuniorHelpVerificationCodeEntity(
      data.help_id,
      data.code,
      data.expires_at,
      data.created_at
    );
  }
}
