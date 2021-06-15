import { NestedWhen } from '../errors';
import { ApplyProp } from '../expectation/expectation';
import { ExpectationRepository } from '../expectation/repository/expectation-repository';
import { setActiveMock } from './map';
import { Mock } from './mock';
import { PendingExpectation } from '../when/pending-expectation';
import { createProxy, Property } from '../proxy';

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

      return createProxy({
        property: (childProp: Property) => {
          pendingExpectation.clear();
          throw new NestedWhen(property, childProp);
        },
        apply: (args: any[]) => {
          // eslint-disable-next-line no-param-reassign
          pendingExpectation.args = args;
        },
      });
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
