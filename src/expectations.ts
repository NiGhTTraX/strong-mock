export interface Expectation {
  returnValue: any;
  args: any[];
  property: string;
}

export class MethodExpectation implements Expectation {
  constructor(
    public args: any[],
    public returnValue: any,
    public property: string
  ) {}
}
