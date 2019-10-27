import { inspect } from 'util';

export class MethodExpectation {
  met: boolean;

  times: number = 1;

  constructor(public args: any[], public returnValue: any, public throws: boolean = false) {
    this.met = false;
  }

  toString() {
    return `${inspect(this.args)} => ${inspect(this.returnValue)}`;
  }
}

export class PropertyExpectation {
  times: number = 1;

  public met: boolean;

  constructor(public returnValue: any, public throws: boolean = false) {
    this.met = false;
  }

  toString() {
    return `=> ${inspect(this.returnValue)}`;
  }
}
