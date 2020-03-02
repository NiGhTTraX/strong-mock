import { EXPECTED_COLOR } from 'jest-matcher-utils';
import isEqual from 'lodash/isEqual';
import { printCall, printProperty } from './print';

export interface Expectation {
  property: PropertyKey;
  args: any[] | undefined;
  returnValue: any;
  min: number;
  max: number;

  matches(property: PropertyKey, args: any[] | undefined): boolean;
}

export class DeepComparisonExpectation implements Expectation {
  constructor(
    public property: PropertyKey,
    public args: any[] | undefined,
    public returnValue: any,
    public min: number = 1,
    public max: number = 1
  ) {}

  // TODO: add matchers
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

    return this.args.every((arg, i) => isEqual(arg, args[i]));
  }

  toString() {
    if (this.args) {
      return `when(mock${EXPECTED_COLOR(
        printCall(this.property, this.args)
      )}).returns(${this.returnValue}).between(${this.min}, ${this.max})`;
    }

    return `when(mock${EXPECTED_COLOR(printProperty(this.property))}).returns(${
      this.returnValue
    }).between(${this.min}, ${this.max})`;
  }
}
