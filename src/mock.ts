import { NotAMock } from './errors';
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

export const mockMap = new Map<Mock<any>, ExpectationRepository>();

export const getRepoForMock = (mock: Mock<any>): ExpectationRepository => {
  if (mockMap.has(mock)) {
    return mockMap.get(mock)!;
  }

  throw new NotAMock();
};

export const ApplyProp = Symbol('apply');

export const createStub = <T>(
  repo: ExpectationRepository,
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

export const mock = <T>(
  repository: ExpectationRepository = new FIFORepository()
): Mock<T> => {
  const stub = createStub<T>(repository);

  mockMap.set(stub, repository);

  return stub;
};
