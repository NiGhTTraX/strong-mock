import { NotAMock } from './errors';
import { ExpectationRepository } from './expectation-repository';
import {
  PendingExpectation,
  RepoSideEffectPendingExpectation
} from './pending-expectation';
import { StrongExpectation } from './strong-expectation';
import { StrongRepository } from './strong-repository';
import { createStub } from './stub';

// TODO: is it possible to return a type here that won't be assignable to T,
// but still has the same properties as T?
export type Mock<T> = T;

/**
 * Since `when()` doesn't receive the mock subject (because we can't make it
 * consistently return it from `mock()`, `mock.bar` and `mock.ba()`) we need
 * to store a global state for the currently active mock.
 *
 * We also want to throw in the following case:
 *
 * ```
 * when(mock()) // forgot returns here
 * when(mock()) // should throw
 * ```
 *
 * For that reason we can't just store the currently active mock, but also
 * whether we finished the expectation or not. We encode those 2 pieces of info
 * in one variable - "pending expectation".
 */
let activeMock: Mock<any> | undefined;

export const setActiveMock = (mock: Mock<any>) => {
  activeMock = mock;
};

export const clearActiveMock = () => {
  activeMock = undefined;
};

export const getActiveMock = (): Mock<any> => {
  return activeMock;
};

type MockState = {
  repository: ExpectationRepository;
  pendingExpectation: PendingExpectation;
};

/**
 * Store a global map of all mocks created and their state.
 *
 * This is needed because we can't reliably pass the state between `when`,
 * `thenReturn` and `instance`.
 */
export const mockMap = new Map<Mock<any>, MockState>();

export const getMockState = (mock: Mock<any>): MockState => {
  if (mockMap.has(mock)) {
    return mockMap.get(mock)!;
  }

  throw new NotAMock();
};

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
