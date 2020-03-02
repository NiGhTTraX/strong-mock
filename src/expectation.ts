import isEqual from 'lodash/isEqual';
import { isMatcher } from './matcher';
import { printExpectation } from './print';

export interface Expectation {
  property: PropertyKey;
  args: any[] | undefined;
  returnValue: any;
  min: number;
  max: number;

  matches(property: PropertyKey, args: any[] | undefined): boolean;
}

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

  toString() {
    return printExpectation(
      this.property,
      this.args,
      this.returnValue,
      this.min,
      this.max
    );
  }
}
