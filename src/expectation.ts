export interface Expectation {
  property: PropertyKey;
  args: any[] | undefined;
  returnValue: any;
  min: number;
  max: number;

  matches(property: PropertyKey, args: any[] | undefined): boolean;

  toJSON(): string;
}

export const ApplyProp = Symbol('apply');
