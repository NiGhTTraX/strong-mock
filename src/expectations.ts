import { inspect } from 'util';

export class MethodExpectation {
  met: boolean;

  times: number = 1;

  constructor(public args: any[], public returnValue: any) {
    this.args = args;
    this.met = false;
    this.returnValue = returnValue;
  }

  toString() {
    return `${inspect(this.args)} => ${inspect(this.returnValue)}`;
  }
}

export class PropertyExpectation {
  times: number = 1;

  public met: boolean;

  constructor(public returnValue: any) {
    this.met = false;
  }

  toString() {
    return `=> ${inspect(this.returnValue)}`;
  }
}
