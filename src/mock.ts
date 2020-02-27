import { NotAMock } from './errors';
import {
  ExpectationRepository,
  FIFORepository
} from './expectation-repository';
import { SINGLETON_PENDING_EXPECTATION } from './pending-expectation';
import { createProxy } from './proxy';

export const repoHolder = Symbol('repo');

export const getRepoForMock = (mock: Mock<any>): ExpectationRepository => {
  if (repoHolder in mock) {
    return mock[repoHolder];
  }

  throw new NotAMock();
};

export type Mock<T> = T;

export const ApplyProp = Symbol('apply');

export const createStub = <T>(repo: ExpectationRepository): Mock<T> => {
  return createProxy<T>(repo, {
    property: property => {
      SINGLETON_PENDING_EXPECTATION.start(repo);
      SINGLETON_PENDING_EXPECTATION.property = property;

      return (...args: any[]) => {
        SINGLETON_PENDING_EXPECTATION.args = args;
      };
    },
    apply: (args: any[]) => {
      SINGLETON_PENDING_EXPECTATION.start(repo);
      SINGLETON_PENDING_EXPECTATION.property = ApplyProp;
      SINGLETON_PENDING_EXPECTATION.args = args;
    }
  });
};

export const mock = <T>(
  repository: ExpectationRepository = new FIFORepository()
): Mock<T> => {
  const stub = createStub<T>(repository);

  // @ts-ignore
  stub[repoHolder] = repository;

  return stub;
};
