import { printExpectation } from '../print';
import { Property } from '../proxy';
import { Expectation, ReturnValue } from './expectation';
import { Matcher } from './matcher';

/**
 * Matches a call with more parameters than expected because it is assumed the
 * compiler will check that those parameters are optional.
 *
 * @example
 * new StrongExpectation(
 *   'bar',
 *   deepEquals([1, 2, 3]),
 *   23
 * ).matches('bar', [1, 2, 3]) === true;
 */
export class StrongExpectation implements Expectation {
  private matched = 0;

  public min: number = 1;

  public max: number = 1;

  constructor(
    public property: Property,
    public args: Matcher[] | undefined,
    public returnValue: ReturnValue
  ) {}

  setInvocationCount(min: number, max = 1) {
    this.min = min;
    this.max = max;
  }

  matches(args: any[] | undefined): boolean {
    if (!this.matchesArgs(args)) {
      return false;
    }

    this.matched++;

    return this.max === 0 || this.matched <= this.max;
  }

  isUnmet(): boolean {
    return this.matched < this.min;
  }

  private matchesArgs(received: any[] | undefined) {
    if (this.args === undefined) {
      return !received;
    }

    if (!received) {
      return false;
    }

    return this.args.every((arg, i) => arg.matches(received[i]));
  }

  toJSON() {
    return printExpectation(
      this.property,
      this.args,
      this.returnValue,
      this.min,
      this.max
    );
  }
}
