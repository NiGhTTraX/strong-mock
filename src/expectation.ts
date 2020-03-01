import isEqual from 'lodash/isEqual';

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
}
