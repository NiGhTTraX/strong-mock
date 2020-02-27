export class Expectation {
  constructor(
    public property: string,
    public args: any[] | undefined,
    public returnValue: any,
    public min: number = 1,
    public max: number = 1
  ) {}
}
