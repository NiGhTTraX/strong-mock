import { ExpectationRepository } from '../repository/expectation-repository';
import { setMockState } from './map';
import {
  ExpectationFactory,
  RepoSideEffectPendingExpectation,
} from '../when/pending-expectation';
import { StrongExpectation } from '../expectation/strong-expectation';
import { StrongRepository } from '../repository/strong-repository';
import { createStub } from './stub';

// TODO: is it possible to return a type here that won't be assignable to T,
// but still has the same properties as T?
export type Mock<T> = T;

const strongExpectationFactory: ExpectationFactory = (
  property,
  args,
  returnValue
) => new StrongExpectation(property, args, returnValue);

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
 * Set expectations on the mock using `when` and `thenReturn` and get an
 * instance from the mock using `instance`.
 *
 * @example
 * const fn = mock<() => number>();
 *
 * when(fn()).thenReturn(23);
 *
 * instance(fn) === 23;
 */
export const mock = <T>({
  repository = new StrongRepository(),
  expectationFactory = strongExpectationFactory,
}: MockOptions = {}): Mock<T> => {
  const pendingExpectation = new RepoSideEffectPendingExpectation(
    expectationFactory
  );

  const stub = createStub<T>(repository, pendingExpectation);

  setMockState(stub, { repository, pendingExpectation });

  return stub;
};
