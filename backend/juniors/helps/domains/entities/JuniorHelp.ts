export class JuniorHelpVerificationCodeEntity {
  constructor(
    public readonly helpId: number,
    public readonly code: number,
    public readonly expiresAt: number,
    public readonly createdAt: Date
  ) {}
}
