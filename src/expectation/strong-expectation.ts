import isEqual from 'lodash/isEqual';
import { Expectation, ReturnValue } from './expectation';
import { isMatcher } from './matcher';
import { printExpectation } from '../print';
import { Property } from '../proxy';

/**
 * Deeply compare actual arguments against expected ones.
 *
 * Supports argument matchers. Matches a call with more parameters
 * than expected because it is assumed the compiler will check that those
 * parameters are optional.
 *
 * @example
 * new Expectation('bar', [1, 2, 3], 23).matches('bar', [1, 2, 3]) === true;
 * new Expectation('bar', [1, 2, 3], 23).matches('bar', [1, 2]) === false;
 * new Expectation('bar', [1, 2], 23).matches('bar', [1, 2, 3]) === true;
 */
export class StrongExpectation implements Expectation {
  private matched = 0;

  public min: number = 1;

  public max: number = 1;

  constructor(
    public property: Property,
    public args: any[] | undefined,
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

  private matchesArgs(args: any[] | undefined) {
    if (this.args === undefined) {
      return !args;
    }

    if (!args) {
      return false;
    }

    return this.args.every((arg, i) => {
      if (arg && isMatcher(arg)) {
        return arg.matches(args[i]);
      }

      return isEqual(arg, args[i]);
    });
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
