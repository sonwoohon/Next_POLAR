export class SeniorHelp {
  constructor(
    public title: string,
    public startDate: string,
    public content: string,
    public category: number | number[],
    public endDate?: string,
    public seniorId?: number,
    public id?: number,
    public status?: string,
    public createdAt?: string,
    public updatedAt?: string
  ) {}
}
