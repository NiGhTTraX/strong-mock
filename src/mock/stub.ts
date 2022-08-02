import { NestedWhen } from '../errors';
import { ApplyProp, ReturnValue } from '../expectation/expectation';
import { ExpectationRepository } from '../expectation/repository/expectation-repository';
import { createProxy, Property } from '../proxy';
import { PendingExpectation } from '../when/pending-expectation';
import { setActiveMock } from './map';
import { Mock, Mode } from './mock';
import { ConcreteMatcher } from './options';

/**
 * Return the expectation's return value.
 *
 * If the value is an error then throw it.
 *
 * If the value is a promise then resolve/reject it.
 */
export const returnOrThrow = ({ isError, isPromise, value }: ReturnValue) => {
  if (isError) {
    if (isPromise) {
      return Promise.reject(value);
    }

    if (value instanceof Error) {
      throw value;
    }

    throw new Error(value);
  }

  if (isPromise) {
    return Promise.resolve(value);
  }

  return value;
};

export const createStub = <T>(
  repo: ExpectationRepository,
  pendingExpectation: PendingExpectation,
  getCurrentMode: () => Mode,
  concreteMatcher: ConcreteMatcher
): Mock<T> => {
  const stub = createProxy<T>({
    property: (property) => {
      if (getCurrentMode() === Mode.CALL) {
        return returnOrThrow(repo.get(property));
      }

      setActiveMock(stub);

      pendingExpectation.start(repo, concreteMatcher);
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
        ownKeys: () => {
          throw new Error('Spreading during an expectation is not supported.');
        },
      });
    },
    apply: (args: any[]) => {
      if (getCurrentMode() === Mode.CALL) {
        const fn = repo.get(ApplyProp);

        // This is not using `returnOrThrow` because the repo will use it.
        return fn.value(...args);
      }

      setActiveMock(stub);

      pendingExpectation.start(repo, concreteMatcher);
      // eslint-disable-next-line no-param-reassign
      pendingExpectation.property = ApplyProp;
      // eslint-disable-next-line no-param-reassign
      pendingExpectation.args = args;

      return undefined;
    },
    ownKeys: () => {
      if (getCurrentMode() === Mode.CALL) {
        return repo.getAllProperties();
      }

      throw new Error('Spreading during an expectation is not supported.');
    },
  });

  return stub;
};
