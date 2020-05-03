import { NotAMock } from './errors';
import {
  ExpectationRepository,
  ExpectationRepository2,
} from './expectation-repository';
import { Mock } from './mock';
import { PendingExpectation } from './pending-expectation';

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

type MockState2 = {
  repository: ExpectationRepository2;
  pendingExpectation: PendingExpectation;
};

/**
 * Store a global map of all mocks created and their state.
 *
 * This is needed because we can't reliably pass the state between `when`,
 * `thenReturn` and `instance`.
 */
export const mockMap = new Map<Mock<any>, MockState>();
export const mockMap2 = new Map<Mock<any>, MockState2>();

export const getMockState = (mock: Mock<any>): MockState => {
  if (mockMap.has(mock)) {
    return mockMap.get(mock)!;
  }

  throw new NotAMock();
};

export const getMockState2 = (mock: Mock<any>): MockState2 => {
  if (mockMap2.has(mock)) {
    return mockMap2.get(mock)!;
  }

  throw new NotAMock();
};
