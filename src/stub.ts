import { ApplyProp } from './expectation';
import { ExpectationRepository } from './expectation-repository';
import { setActiveMock } from './map';
import { Mock } from './mock';
import { PendingExpectation } from './pending-expectation';
import { createProxy } from './proxy';

export const createStub = <T>(
  repo: ExpectationRepository,
  pendingExpectation: PendingExpectation
): Mock<T> => {
  const stub = createProxy<T>({
    property: (property) => {
      setActiveMock(stub);

      pendingExpectation.start(repo);
      // eslint-disable-next-line no-param-reassign
      pendingExpectation.property = property;

      return (...args: any[]) => {
        // eslint-disable-next-line no-param-reassign
        pendingExpectation.args = args;
      };
    },
    apply: (args: any[]) => {
      setActiveMock(stub);

      pendingExpectation.start(repo);
      // eslint-disable-next-line no-param-reassign
      pendingExpectation.property = ApplyProp;
      // eslint-disable-next-line no-param-reassign
      pendingExpectation.args = args;
    },
  });
  return stub;
};
