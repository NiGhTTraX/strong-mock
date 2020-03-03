import isEqual from 'lodash/isEqual';
import { Expectation } from './expectation';
import { isMatcher } from './matcher';
import { printExpectation } from './print';

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
  constructor(
    public property: PropertyKey,
    public args: any[] | undefined,
    public returnValue: any,
    public min: number = 1,
    public max: number = 1
  ) {}

  matches(property: PropertyKey, args: any[] | undefined): boolean {
    if (property !== this.property) {
      return false;
    }

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
