import { inspect } from 'util';
import { Expectation } from './expectations';

export class MethodExpectation extends Expectation {
  constructor(
    public args: any[],
    public returnValue: any,
    public throws: boolean = false
  ) {
    super(returnValue, throws);
  }

  toString(includeReturnValue = true) {
    const ret = `${this.formatArgs()}`;

    return includeReturnValue
      ? `${ret} ${this.formatReturnValue()} ${this.formatInvocationCount()}`
      : `${ret} ${this.formatInvocationCount()}`;
  }

  private formatArgs = () => inspect(this.args);
}
