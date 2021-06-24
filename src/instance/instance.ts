import { ApplyProp } from '../expectation/expectation';
import { getMockState } from '../mock/map';
import { Mock } from '../mock/mock';
import { createProxy } from '../proxy';

/**
 * Return the expectation's return value. If the value is an error then
 * throw it.
 */
export const returnOrThrow = (returnValue: any) => {
  if (returnValue instanceof Error) {
    throw returnValue;
  }

  return returnValue;
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

      return returnOrThrow(fn(...args));
    },
    ownKeys: () => repository.getAllProperties(),
  });
};
