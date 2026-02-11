import type { Matcher } from '../matchers/matcher.js';

export type ConcreteMatcher = <T>(expected: T) => Matcher;

export enum UnexpectedProperty {
  /**
   * Throw an error immediately.
   *
   * @example
   * // Will throw "Didn't expect foo to be accessed".
   * const { foo } = service;
   *
   * // Will throw "Didn't expect foo to be accessed",
   * // without printing the arguments.
   * foo(42);
   */
  THROW,

  /**
   * Return a function that will throw if called. This can be useful if your
   * code destructures a function but never calls it.
   *
   * It will also improve error messages for unexpected calls because arguments
   * will be captured instead of throwing immediately on the property access.
   *
   * The function will be returned even if the property is not supposed to be a
   * function. This could cause weird behavior at runtime, when your code expects
   * e.g. a number and gets a function instead.
   *
   * @example
   * // This will NOT throw.
   * const { foo } = service;
   *
   * // This will NOT throw, and might produce unexpected results.
   * foo > 0
   *
   * // Will throw "Didn't expect foo(42) to be called".
   * foo(42);
   */
  CALL_THROW,
}

export interface MockOptions {
  /**
   * The name of the mock that will be used in error messages. Defaults to `mock`.
   *
   * This can be useful when you want to easily identify the mock from the test
   * output, especially if you have multiple mocks in the same test.
   *
   * @example
   * const service = mock<Service>({ name: 'Service' });
   * service.foo() // "Didn't expect Service.foo() to be called"
   */
  name?: string;

  /**
   * Controls what should be returned for a property with no expectations.
   *
   * A property with no expectations is a property that has no `when`
   * expectations set on it. It can also be a property that ran out of `when`
   * expectations.
   *
   * The default is to return a function that will throw when called.
   *
   * @example
   * const foo = mock<{ bar: () => number }>();
   * foo.bar() // unexpected property access
   *
   * @example
   * const foo = mock<{ bar: () => number }>();
   * when(() => foo.bar()).thenReturn(42);
   * foo.bar() === 42
   * foo.bar() // unexpected property access
   */
  unexpectedProperty?: UnexpectedProperty;

  /**
   * If `true`, the number of received arguments in a function/method call has to
   * match the number of arguments set in the expectation.
   *
   * If `false`, extra parameters are considered optional and checked by the
   * TypeScript compiler instead.
   *
   * You may want to set this to `true` if you're not using TypeScript,
   * or if you want to be extra strict.
   *
   * @example
   * const fn = mock<(value?: number) => number>({ exactParams: true });
   * when(() => fn()).thenReturn(42);
   *
   * fn(100) // throws with exactParams, returns 42 without
   */
  exactParams?: boolean;

  /**
   * The matcher that will be used when one isn't specified explicitly.
   *
   * The most common use case is replacing the default {@link It.deepEquals}
   * matcher with {@link It.is}, but you can also use {@link It.matches} to
   * create a custom matcher.
   *
   * @param expected The concrete expected value received from the
   *   {@link when} expectation.
   *
   * @example
   * const fn = mock<(value: number[]) => string>({
   *   concreteMatcher: It.is
   * });
   *
   * const expected = [1, 2, 3];
   * when(() => fn(expected).thenReturn('matched');
   *
   * fn([1, 2, 3]); // throws because different array instance
   * fn(expected); // matched
   */
  concreteMatcher?: ConcreteMatcher;
}
