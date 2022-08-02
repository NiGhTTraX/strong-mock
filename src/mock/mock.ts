import { isMatcher } from '../expectation/matcher';
import { FlexibleRepository } from '../expectation/repository/flexible-repository';
import { StrongExpectation } from '../expectation/strong-expectation';
import {
  ExpectationFactory,
  RepoSideEffectPendingExpectation,
} from '../when/pending-expectation';
import { currentDefaults, StrongMockDefaults } from './defaults';
import { setMockState } from './map';
import { MockOptions } from './options';
import { createStub } from './stub';

export type Mock<T> = T;

const strongExpectationFactory: ExpectationFactory = (
  property,
  args,
  returnValue,
  concreteMatcher
) =>
  new StrongExpectation(
    property,
    // Wrap every non-matcher in the default matcher.
    args?.map((arg) => (isMatcher(arg) ? arg : concreteMatcher(arg))),
    returnValue
  );

export enum Mode {
  EXPECT,
  CALL,
}

export let currentMode: Mode = Mode.CALL;

export const setMode = (mode: Mode) => {
  currentMode = mode;
};

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
}: MockOptions = {}): Mock<T> => {
  const pendingExpectation = new RepoSideEffectPendingExpectation(
    strongExpectationFactory
  );

  const options: StrongMockDefaults = {
    strictness: strictness ?? currentDefaults.strictness,
    concreteMatcher: concreteMatcher ?? currentDefaults.concreteMatcher,
  };

  const repository = new FlexibleRepository(options.strictness);

  const stub = createStub<T>(
    repository,
    pendingExpectation,
    () => currentMode,
    options.concreteMatcher
  );

  setMockState(stub, {
    repository,
    pendingExpectation,
    options,
  });

  return stub;
};
