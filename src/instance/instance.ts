import { ReturnValue } from '../expectation/expectation';
import { getMockState } from '../mock/map';
import { Mock } from '../mock/mock';
import { createStub } from '../mock/stub';

// Keep a cache of all mock instances so that we can return a stable reference
// if `instance` is used multiple times.
const cache = new Map<Mock<any>, any>();

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
  if (cache.has(mock)) {
    return cache.get(mock);
  }

  const { repository, pendingExpectation } = getMockState(mock);

  const proxy = createStub<T>(repository, pendingExpectation, () => false);

  cache.set(mock, proxy);

  return proxy;
};
