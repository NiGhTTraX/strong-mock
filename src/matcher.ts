export type Matcher<T> = T & {
  matches: (arg: any) => arg is T;
  __isMatcher: boolean;
}

export function isMatcher(f: any): f is Matcher<any> {
  return (<Matcher<any>>f).__isMatcher;
}

/**
 * Match any value.
 *
 * The compiler will make sure the type is correct and the matcher
 * will permit any value.
 *
 * @example
 * ```
 * const mock = new Mock<(x: number, y: string) => number>();
 * mock.when(f => f(It.isAny, It.isAny)).returns(1);
 *
 * mock.stub(23, 'foobar') === 1
 * mock.stub(23, true) // compiler error
 * ```
 */
const isAny: Matcher<any> = {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  matches: (arg: any): arg is any => true,
  __isMatcher: true,

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return 'any';
  }
};

/**
 * Match a custom predicate.
 *
 * @param cb Will receive the value and returns whether it matches.
 *
 * @example
 * ```
 * type Foobar = { foo: 'string', bar: number };
 *
 * const mock = new Mock<(x: Foobar) => number>();
 * mock.when(f => f(It.matches(x => x.foo === 'bar')).returns(1);
 * mock.when(f => f(It.matches(x => x.bar >= 3)).returns(2);
 *
 * mock.stub({foo: 'bar', bar: 0 }) === 1
 * mock.stub({foo: 'baz', bar: 0 }) // throws
 * ```
 */
const matches = <T>(cb: (arg: T) => boolean): Matcher<T> => ({
  matches: (arg: any): arg is T => cb(arg),
  __isMatcher: true,

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return cb.toString();
  }
} as any);

export const It = {
  isAny,
  matches
};
