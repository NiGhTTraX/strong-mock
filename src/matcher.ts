export type Matcher<T> = {
  matches: (arg: any) => arg is T;
  __isMatcher: boolean;
}

export function isMatcher(f: any): f is Matcher<any> {
  return (<Matcher<any>>f).__isMatcher;
}

export type AllowAnyArgs<T extends any[]> = {
  [K in keyof T]: T[K] | Matcher<T[K]>;
}

type AllowAnyForProperties<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: AllowAnyArgs<A>) => R
    : T[K];
};

export type AllowAny<T> = T extends (...args: infer A) => infer R
  ? ((...args: AllowAnyArgs<A>) => R) & AllowAnyForProperties<T>
  : AllowAnyForProperties<T>;

const isAnyNumber: Matcher<number> = {
  matches: (arg: any): arg is number => typeof arg === 'number',
  __isMatcher: true
};

const isAnyString: Matcher<string> = {
  matches: (arg: any): arg is string => typeof arg === 'string',
  __isMatcher: true
};

const isAny: Matcher<any> = {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  matches: (arg: any): arg is any => true,
  __isMatcher: true
};

const matches = (cb: (arg: any) => boolean): Matcher<any> => ({
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  matches: (arg: any): arg is any => cb(arg),
  __isMatcher: true
});

export const It = {
  isAnyNumber,
  isAnyString,
  isAny,
  matches
};
