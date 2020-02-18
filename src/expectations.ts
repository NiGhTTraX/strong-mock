export interface Expectation {
  returnValue: any;
  args: any[];
}

export class MethodExpectation implements Expectation {
  constructor(public args: any[], public returnValue: any) {}
}
