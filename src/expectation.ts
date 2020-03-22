export interface Expectation {
  property: PropertyKey;
  args: any[] | undefined;
  returnValue: any;

  /**
   * How many times should this expectation match?
   */
  setInvocationCount(min: number, max: number): void;

  /**
   * Should take into account the property, the args and how invocation count.
   */
  matches(property: PropertyKey, args: any[] | undefined): boolean;

  isUnmet(): boolean;

  /**
   * Used by `pretty-format`.
   */
  toJSON(): string;
}

/**
 * Special symbol denoting the call of a function.
 */
export const ApplyProp = Symbol('apply');
