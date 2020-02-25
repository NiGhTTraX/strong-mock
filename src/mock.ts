import { ExpectationRepository } from './expectation-repository';
import { PendingExpectation } from './pending-expectation';
import { createProxy } from './proxy';

export const MockMap = new Map<Mock<unknown>, ExpectationRepository>();

export type Mock<T> = T;

export const createStub = <T>(repo: ExpectationRepository): Mock<T> => {
  const pendingExpectation = new PendingExpectation();

  return createProxy<T>({
    property: property => {
      pendingExpectation.start(repo);
      pendingExpectation.property = property;
    },
    method: args => {
      pendingExpectation.args = args;

      return pendingExpectation;
    },
    apply: (args: any[]) => {
      pendingExpectation.start(repo);
      pendingExpectation.property = '';
      pendingExpectation.args = args;

      return pendingExpectation;
    }
  });
};

export const strongMock = <T>(): Mock<T> => {
  const repo = new ExpectationRepository();
  const stub = createStub<T>(repo);

  MockMap.set(stub, repo);

  return stub;
};
