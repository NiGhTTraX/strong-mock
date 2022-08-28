export type ReturnValue = {
  value: any;
  isPromise?: boolean;
  isError?: boolean;
};

/**
 * Unbox the expectation's return value.
 *
 * If the value is an error then throw it.
 *
 * If the value is a promise then resolve/reject it.
 */
export const unboxReturnValue = ({
  isError,
  isPromise,
  value,
}: ReturnValue) => {
  if (isError) {
    if (value instanceof Error) {
      if (isPromise) {
        return Promise.reject(value);
      }
      throw value;
    }

    if (isPromise) {
      return Promise.reject(new Error(value));
    }

    throw new Error(value);
  }

  if (isPromise) {
    return Promise.resolve(value);
  }

  return value;
};
