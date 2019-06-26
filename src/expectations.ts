import { inspect } from 'util';

export class MethodExpectation {
  public args: any[];

  public r: any;

  public met: boolean;

  constructor(args: any[], r: any) {
    this.args = args;
    this.met = false;
    this.r = r;
  }

  toString() {
    return `${inspect(this.args)} => ${inspect(this.r)}`;
  }
}

export class PropertyExpectation {
  public r: any;

  public met: boolean;

  constructor(r: any) {
    this.met = false;
    this.r = r;
  }

  toString() {
    return `=> ${inspect(this.r)}`;
  }
}
