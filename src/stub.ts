import { ApplyProp } from './expectation';
import { ExpectationRepository } from './expectation-repository';
import { Mock } from './mock';
import {
  PendingExpectation,
  SINGLETON_PENDING_EXPECTATION
} from './pending-expectation';
import { createProxy } from './proxy';

export const createStub = <T>(
  repo: ExpectationRepository,
  // TODO: create a factory for pending expectations and a getter from mock
  // to a pending expectation; then push this dependency up the call stack
  // so that consumers of `mock()` can supply their own type of expectation
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
