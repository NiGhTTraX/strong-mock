import { isMatcher } from '../expectation/matcher';
import { StrongRepository } from '../expectation/repository/strong-repository';
import { StrongExpectation } from '../expectation/strong-expectation';
import {
  ExpectationFactory,
  RepoSideEffectPendingExpectation,
} from '../when/pending-expectation';
import { currentDefaults } from './defaults';
import { setMockState } from './map';
import { createStub } from './stub';

export type Mock<T> = T;

const strongExpectationFactory: ExpectationFactory = (
  property,
  args,
  returnValue
) =>
  new StrongExpectation(
    property,
    // Wrap every non-matcher in the default matcher.
    args?.map((arg) => (isMatcher(arg) ? arg : currentDefaults.matcher(arg))),
    returnValue
  );

export let isRecording = false;

export const setRecording = (recording: boolean) => {
  isRecording = recording;
};

/**
 * Create a type safe mock.
 *
 * @see {@link when} Set expectations on the mock using `when`.
 *
 * @example
 * const fn = mock<() => number>();
 *
 * when(() => fn()).thenReturn(23);
 *
 * fn() === 23;
 */
export const mock = <T>(): Mock<T> => {
  const pendingExpectation = new RepoSideEffectPendingExpectation(
    strongExpectationFactory
  );

  const repository = new StrongRepository();
  const stub = createStub<T>(repository, pendingExpectation, () => isRecording);

  setMockState(stub, { repository, pendingExpectation });

  return stub;
};
