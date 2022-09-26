import { isMatcher } from '../expectation/matcher';
import { FlexibleRepository } from '../expectation/repository/flexible-repository';
import { StrongExpectation } from '../expectation/strong-expectation';
import type { ExpectationFactory } from '../when/pending-expectation';
import { PendingExpectationWithFactory } from '../when/pending-expectation';
import type { StrongMockDefaults } from './defaults';
import { currentDefaults } from './defaults';
import { setMockState } from './map';
import type { MockOptions } from './options';
import { createStub } from './stub';

export type Mock<T> = T;

const strongExpectationFactory: ExpectationFactory = (
  property,
  args,
  returnValue,
  concreteMatcher,
  exactParams
) =>
  new StrongExpectation(
    property,
    // Wrap every non-matcher in the default matcher.
    args?.map((arg) => (isMatcher(arg) ? arg : concreteMatcher(arg))),
    returnValue,
    exactParams
  );

export enum Mode {
  EXPECT,
  CALL,
}

export let currentMode: Mode = Mode.CALL;

export const setMode = (mode: Mode) => {
  currentMode = mode;
};
const getMode = () => currentMode;

/**
 * Create a type safe mock.
 *
 * @see {@link when} Set expectations on the mock using `when`.
 *
 * @param options Configure the options for this specific mock, overriding any
 *   defaults that were set with {@link setDefaults}.
 * @param options.strictness Controls what happens when a property is accessed,
 *   or a call is made, and there are no expectations set for it.
 * @param options.concreteMatcher The matcher that will be used when one isn't specified explicitly.
 * @param options.exactParams Controls whether the number of received arguments has to
 *   match the expectation.
 *
 * @example
 * const fn = mock<() => number>();
 *
 * when(() => fn()).thenReturn(23);
 *
 * fn() === 23;
 */
export const mock = <T>({
  strictness,
  concreteMatcher,
  exactParams,
}: MockOptions = {}): Mock<T> => {
  const options: StrongMockDefaults = {
    strictness: strictness ?? currentDefaults.strictness,
    concreteMatcher: concreteMatcher ?? currentDefaults.concreteMatcher,
    exactParams: exactParams ?? currentDefaults.exactParams,
  };

  const repository = new FlexibleRepository(options.strictness);

  const pendingExpectation = new PendingExpectationWithFactory(
    strongExpectationFactory,
    options.concreteMatcher,
    options.exactParams
  );

  const stub = createStub<T>(repository, pendingExpectation, getMode);

  setMockState(stub, {
    repository,
    pendingExpectation,
    options,
  });

  return stub;
};
