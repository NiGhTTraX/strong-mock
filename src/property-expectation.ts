import { Expectation } from './expectations';

export class PropertyExpectation extends Expectation {
  constructor(public returnValue: any, public throws: boolean = false) {
    super(returnValue, throws);
  }

  toString(includeReturnValue = true) {
    return includeReturnValue
      ? `${this.formatReturnValue()} ${this.formatInvocationCount()}`
      : this.formatInvocationCount();
  }
}
