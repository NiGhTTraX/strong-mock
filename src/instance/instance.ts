import { ApplyProp, ReturnValue } from '../expectation/expectation';
import { getMockState } from '../mock/map';
import { Mock } from '../mock/mock';
import { createProxy } from '../proxy';

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

/**
 * Get a real instance from the mock that you can pass to your code under test.
 */
export const instance = <T>(mock: Mock<T>): T => {
  const { repository } = getMockState(mock);

  return createProxy<T>({
    property: (property) => returnOrThrow(repository.get(property)),
    apply: (args: any[]) => {
      const fn = repository.get(ApplyProp);

      // This is not using `returnOrThrow` because the repo will use it.
      return fn.value(...args);
    },
    ownKeys: () => repository.getAllProperties(),
  });
};
