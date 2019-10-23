import { inspect } from 'util';

export interface Expectation {
  r: any;
  met: boolean;
  times: number;
}

export class MethodExpectation implements Expectation {
  met: boolean;

  times: number = 1;

  constructor(public args: any[], public r: any) {
    this.args = args;
    this.met = false;
    this.r = r;
  }

  toString() {
    return `${inspect(this.args)} => ${inspect(this.r)}`;
  }
}

export class PropertyExpectation implements Expectation {
  times: number = 1;

  public met: boolean;

  constructor(public r: any) {
    this.met = false;
  }

  toString() {
    return `=> ${inspect(this.r)}`;
  }
}
