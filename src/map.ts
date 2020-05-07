import { NotAMock } from './errors';
import { ExpectationRepository } from './expectation-repository';
import { Mock } from './mock';
import { PendingExpectation } from './pending-expectation';

/**
 * Since `when()` doesn't receive the mock subject (because we can't make it
 * consistently return it from `mock()`, `mock.foo` and `mock.bar()`) we need
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
 * whether we finished the expectation or not.
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
const mockMap = new Map<Mock<any>, MockState>();

export const getMockState = (mock: Mock<any>): MockState => {
  if (mockMap.has(mock)) {
    return mockMap.get(mock)!;
  }

  throw new NotAMock();
};

export const setMockState = (mock: Mock<any>, state: MockState): void => {
  mockMap.set(mock, state);
};
