export type ReturnValue = {
  value: any;
  isPromise?: boolean;
  promiseValue?: any;
  isError?: boolean;
};

export interface Expectation {
  property: PropertyKey;

  /**
   * `undefined` means this is a property expectation.
   * `[]` means this is a function call with no arguments.
   */
  args: any[] | undefined;

  returnValue: ReturnValue;

  min: number;

  max: number;

  /**
   * How many times should this expectation match?
   */
  setInvocationCount(min: number, max: number): void;

  matches(args: any[] | undefined): boolean;

  /**
   * Used by `pretty-format`.
   */
  toJSON(): string;
}

/**
 * Special symbol denoting the call of a function.
 */
export const ApplyProp = Symbol('apply');
