import { FlexibleRepository } from '../expectation/repository/flexible-repository.js';
import { StrongExpectation } from '../expectation/strong-expectation.js';
import { isMatcher } from '../matchers/matcher.js';
import type { ExpectationFactory } from '../when/expectation-builder.js';
import { ExpectationBuilderWithFactory } from '../when/expectation-builder.js';
import type { StrongMockDefaults } from './defaults.js';
import { currentDefaults } from './defaults.js';
import { setMockState } from './map.js';
import { getMode } from './mode.js';
import type { MockOptions } from './options.js';
import { createStub } from './stub.js';

export type Mock<T> = T;

const strongExpectationFactory: ExpectationFactory = (
  property,
  args,
  returnValue,
  concreteMatcher,
  exactParams,
) =>
  new StrongExpectation(
    property,
    // Wrap every non-matcher in the default matcher.
    args?.map((arg) => (isMatcher(arg) ? arg : concreteMatcher(arg))),
    returnValue,
    exactParams,
  );

/**
 * Create a type safe mock.
 *
 * @see {@link when} Set expectations on the mock using `when`.
 *
 * @param options Configure the options for this specific mock, overriding any
 *   defaults that were set with {@link setDefaults}.
 * @param options.unexpectedProperty Controls what happens when an unexpected
 *   property is accessed.
 * @param options.concreteMatcher The matcher that will be used when one isn't
 *   specified explicitly.
 * @param options.exactParams Controls whether the number of received arguments
 *   has to match the expectation.
 *
 * @example
 * const fn = mock<() => number>();
 *
 * when(() => fn()).thenReturn(23);
 *
 * fn() === 23;
 */
export const mock = <T>({
  unexpectedProperty,
  concreteMatcher,
  exactParams,
}: MockOptions = {}): Mock<T> => {
  const options: StrongMockDefaults = {
    unexpectedProperty:
      unexpectedProperty ?? currentDefaults.unexpectedProperty,
    concreteMatcher: concreteMatcher ?? currentDefaults.concreteMatcher,
    exactParams: exactParams ?? currentDefaults.exactParams,
  };

  const repository = new FlexibleRepository(options.unexpectedProperty);

  const builder = new ExpectationBuilderWithFactory(
    strongExpectationFactory,
    options.concreteMatcher,
    options.exactParams,
  );

  const stub = createStub<T>(repository, builder, getMode);

  setMockState(stub, {
    repository,
    builder,
    options,
  });

  return stub;
};
