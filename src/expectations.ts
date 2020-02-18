export interface Expectation {
  returnValue: any;
  args: any[];
}

export class MethodExpectation implements Expectation {
  returnValue: any;

  constructor(public args: any[]) {}
}
