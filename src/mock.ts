import { ExpectationRepository } from './expectation-repository';
import { mockMap } from './map';
import { RepoSideEffectPendingExpectation } from './pending-expectation';
import { StrongExpectation } from './strong-expectation';
import { StrongRepository } from './strong-repository';
import { createStub } from './stub';

// TODO: is it possible to return a type here that won't be assignable to T,
// but still has the same properties as T?
export type Mock<T> = T;

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
export const mock = <T>(
  repository: ExpectationRepository = new StrongRepository()
): Mock<T> => {
  const pendingExpectation = new RepoSideEffectPendingExpectation(
    (property, args, returnValue) =>
      new StrongExpectation(property, args, returnValue)
  );

  const stub = createStub<T>(repository, pendingExpectation);

  mockMap.set(stub, { repository, pendingExpectation });

  return stub;
};
