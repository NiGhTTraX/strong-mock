import { Matcher } from '../expectation/matcher';

export type ConcreteMatcher = <T>(expected: T) => Matcher;

/**
 * Controls what happens when a property is accessed, or a call is made,
 * and there are no expectations set for it.
 */
export enum Strictness {
  /**
   * Any property that's accessed, or any call that's made, without a matching
   * expectation, will throw immediately.
   *
   * @example
   * type Service = { foo: (x: number) => number };
   * const service = mock<Service>();
   *
   * // This will throw.
   * const { foo } = service;
   *
   * // Will throw "Didn't expect foo to be accessed",
   * // without printing the arguments.
   * foo(42);
   */
  SUPER_STRICT,
  /**
   * Properties with unmatched expectations will return functions that will
   * throw if called. This can be useful if your code destructures a function
   * but never calls it.
   *
   * It will also improve error messages for unexpected calls because arguments
   * will be captured instead of throwing immediately on the property access.
   *
   * @example
   * type Service = { foo: (x: number) => number };
   * const service = mock<Service>();
   *
   * // This will not throw.
   * const { foo } = service;
   *
   * // Will throw "Didn't expect foo(42) to be called".
   * foo(42);
   */
  STRICT,
}

export interface MockOptions {
  /**
   * Controls what happens when a property is accessed, or a call is made,
   * and there are no expectations set for it.
   */
  strictness?: Strictness;

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
   * const fn = mock<(value: number[]) => boolean>({
   *   concreteMatcher: It.is
   * });
   *
   * const expected = [1, 2, 3];
   * when(() => fn(expected).thenReturn(true);
   *
   * fn([1, 2, 3]); // throws because different array instance
   * fn(expected); // OK
   */
  concreteMatcher?: ConcreteMatcher;
}
