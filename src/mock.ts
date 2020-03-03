import { NotAMock } from './errors';
import { ApplyProp } from './expectation';
import {
  ExpectationRepository,
  FIFORepository
} from './expectation-repository';
import {
  PendingExpectation,
  SINGLETON_PENDING_EXPECTATION
} from './pending-expectation';
import { createProxy } from './proxy';

// TODO: is it possible to return a type here that won't be assignable to T,
// but still has the same properties as T?
export type Mock<T> = T;

/**
 * Store a global map of all mocks created and their expectation repositories.
 *
 * This is needed because we can't reliably pass the repository between `when`,
 * `thenReturn` and `instance`.
 */
export const mockMap = new Map<Mock<any>, ExpectationRepository>();

export const getRepoForMock = (mock: Mock<any>): ExpectationRepository => {
  if (mockMap.has(mock)) {
    return mockMap.get(mock)!;
  }

  throw new NotAMock();
};

export const createStub = <T>(
  repo: ExpectationRepository,
  // TODO: create a factory for pending expectations and a getter from mock
  // to a pending expectation; then push this dependency up the call stack
  // so that consumers of `mock()` can supply their own type of expectation
  pendingExpectation: PendingExpectation = SINGLETON_PENDING_EXPECTATION
): Mock<T> => {
  return createProxy<T>({
    property: property => {
      pendingExpectation.start(repo);
      // eslint-disable-next-line no-param-reassign
      pendingExpectation.property = property;

      return (...args: any[]) => {
        // eslint-disable-next-line no-param-reassign
        pendingExpectation.args = args;
      };
    },
    apply: (args: any[]) => {
      pendingExpectation.start(repo);
      // eslint-disable-next-line no-param-reassign
      pendingExpectation.property = ApplyProp;
      // eslint-disable-next-line no-param-reassign
      pendingExpectation.args = args;
    }
  });
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
  repository: ExpectationRepository = new FIFORepository()
): Mock<T> => {
  const stub = createStub<T>(repository);

  mockMap.set(stub, repository);

  return stub;
};
