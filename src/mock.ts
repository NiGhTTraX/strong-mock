import { NotAMock } from './errors';
import { ExpectationRepository } from './expectation-repository';
import { StrongRepository } from './strong-repository';
import { createStub } from './stub';

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
  const stub = createStub<T>(repository);

  mockMap.set(stub, repository);

  return stub;
};
