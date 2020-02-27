export interface Expectation {
  min: number;
  max: number;
  returnValue: any;
  args?: any[];
  property: string;
}

export class MethodExpectation implements Expectation {
  constructor(
    // TODO: flip params
    public args: any[] | undefined,
    public returnValue: any,
    public property: string,
    public min: number = 1,
    public max: number = 1
  ) {}
}
