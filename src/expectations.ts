export interface Expectation {
  returnValue: any;
  args?: any[];
  property: string;
}

export class MethodExpectation implements Expectation {
  constructor(
    // TODO: flip params
    public args: any[] | undefined,
    public returnValue: any,
    public property: string
  ) {}
}
