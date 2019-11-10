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

  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(public returnValue: any, public throws: boolean) {}

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

  protected formatInvocationCount = (): string => {
    if (this.min === this.max) {
      return `exactly ${this.min} time(s)`;
    }

    if (!Number.isFinite(this.max)) {
      return 'at least once';
    }

    return `between ${this.min} and ${this.max} times`;
  };

  protected formatReturnValue = (): string => {
    if (this.throws) {
      return `throws '${this.returnValue}'`;
    }

    return `=> ${inspect(this.returnValue)}`;
  };
}

export class MethodExpectation extends Expectation {
  constructor(public args: any[], public returnValue: any, public throws: boolean = false) {
    super(returnValue, throws);
  }

  toString() {
    return `${(this.formatArgs())} ${this.formatReturnValue()} ${this.formatInvocationCount()}`;
  }

  private formatArgs = () => inspect(this.args);
}

export class PropertyExpectation extends Expectation {
  constructor(public returnValue: any, public throws: boolean = false) {
    super(returnValue, throws);
  }

  toString() {
    return `${this.formatReturnValue()} ${this.formatInvocationCount()}`;
  }
}
