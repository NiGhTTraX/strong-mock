import { inspect } from 'util';

class Expectation {
  /**
   * Current invocation count.
   */
  count: number = 0;

  /**
   * Min number of invocations to be considered met.
   */
  min: number = 1;

  /**
   * Max allowed number of invocations.
   */
  max: number = 1;

  /**
   * Has the expectation been met?
   */
  get met(): boolean {
    return this.count >= this.min && this.count <= this.max;
  }

  /**
   * Are there invocations left for this expectation?
   */
  get available(): boolean {
    return this.count < this.max;
  }
}

export class MethodExpectation extends Expectation {
  constructor(public args: any[], public returnValue: any, public throws: boolean = false) {
    super();
  }

  toString() {
    return `${inspect(this.args)} => ${inspect(this.returnValue)}`;
  }
}

export class PropertyExpectation extends Expectation {
  constructor(public returnValue: any, public throws: boolean = false) {
    super();
  }

  toString() {
    return `=> ${inspect(this.returnValue)}`;
  }
}
