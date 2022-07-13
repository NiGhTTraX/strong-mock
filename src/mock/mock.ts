import { isMatcher } from '../expectation/matcher';
import { ExpectationRepository } from '../expectation/repository/expectation-repository';
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

interface MockOptions {
  /**
   * You can provide your own repository to store and find expectations.
   */
  repository?: ExpectationRepository;

  /**
   * You can provide your own way of creating expectations.
   */
  expectationFactory?: ExpectationFactory;
}

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
export const mock = <T>({
  repository = new StrongRepository(),
  expectationFactory = strongExpectationFactory,
}: MockOptions = {}): Mock<T> => {
  const pendingExpectation = new RepoSideEffectPendingExpectation(
    expectationFactory
  );

  const stub = createStub<T>(repository, pendingExpectation, () => isRecording);

  setMockState(stub, { repository, pendingExpectation });

  return stub;
};
