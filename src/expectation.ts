export interface Expectation {
  property: PropertyKey;
  args: any[] | undefined;
  returnValue: any;
  min: number;
  max: number;

  matches(property: PropertyKey, args: any[] | undefined): boolean;

  /**
   * Used by `pretty-format`.
   */
  toJSON(): string;
}

/**
 * Special symbol denoting the call of a function.
 */
export const ApplyProp = Symbol('apply');
