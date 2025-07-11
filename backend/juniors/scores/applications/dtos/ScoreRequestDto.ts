export class ScoreRequestDtoWithUserId {
  constructor(public readonly userId: number) {}
}

export class ScoreRequestDtoWithCategoryId {
  constructor(public readonly categoryId: number) {}
}

export class ScoreRequestDtoWithSeason {
  constructor(public readonly season: number) {}
}

export class ScoreRequestDtoWithUserIdAndSeason {
  constructor(public readonly userId: number, public readonly season: number) {}
}

export class ScoreRequestDtoWithCategoryIdAndSeason {
  constructor(
    public readonly categoryId: number,
    public readonly season: number
  ) {}
}

export class ScoreRequestDtoWithUserIdAndCategoryId {
  constructor(
    public readonly userId: number,
    public readonly categoryId: number
  ) {}
}
