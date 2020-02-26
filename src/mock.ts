import { ExpectationRepository } from './expectation-repository';
import { singletonPendingExpectation } from './pending-expectation';
import { createProxy } from './proxy';

export const MockMap = new Map<Mock<unknown>, ExpectationRepository>();

export type Mock<T> = T;

// TODO: make Symbol and support mocking symbols
export const ApplyProp = '';

export const createStub = <T>(repo: ExpectationRepository): Mock<T> => {
  return createProxy<T>({
    property: property => {
      singletonPendingExpectation.start(repo);
      singletonPendingExpectation.property = property;
    },
    method: (args, property) => {
      // TODO: the property should have already been set in the `property` trap
      singletonPendingExpectation.property = property;
      singletonPendingExpectation.args = args;
    },
    apply: (args: any[]) => {
      singletonPendingExpectation.start(repo);
      singletonPendingExpectation.property = ApplyProp;
      singletonPendingExpectation.args = args;
    }
  });
};

export const strongMock = <T>(): Mock<T> => {
  const repo = new ExpectationRepository();
  const stub = createStub<T>(repo);

  MockMap.set(stub, repo);

  return stub;
};
