export class Expectation {
  constructor(
    // TODO: flip params
    public args: any[] | undefined,
    public returnValue: any,
    public property: string,
    public min: number = 1,
    public max: number = 1
  ) {}
}
