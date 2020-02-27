import { NotAMock } from './errors';
import {
  ExpectationRepository,
  FIFORepository
} from './expectation-repository';
import { SINGLETON_PENDING_EXPECTATION } from './pending-expectation';
import { createProxy } from './proxy';

export const repoHolder = Symbol('repo');

export const getRepoForStub = (stub: Mock<any>): ExpectationRepository => {
  if (repoHolder in stub) {
    return stub[repoHolder];
  }

  throw new NotAMock();
};

export type Mock<T> = T;

// TODO: make Symbol and support mocking symbols
export const ApplyProp = '';

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

export const strongMock = <T>(
  repository: ExpectationRepository = new FIFORepository()
): Mock<T> => {
  const stub = createStub<T>(repository);

  // @ts-ignore
  stub[repoHolder] = repository;

  return stub;
};
