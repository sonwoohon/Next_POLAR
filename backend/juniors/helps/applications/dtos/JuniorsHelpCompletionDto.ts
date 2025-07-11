export class JuniorsHelpCompletionDto {
  constructor(
    public readonly helpId: number,
    public readonly verificationCode: number
  ) {}
}

export class JuniorsHelpCompletionResponseDto {
  constructor(public readonly success: boolean) {}
}
