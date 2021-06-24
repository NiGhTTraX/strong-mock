import { ReturnValue } from '../expectation/expectation';
import { createInvocationCount, InvocationCount } from './invocation-count';
import { PendingExpectation } from '../when/pending-expectation';

type PromiseStub<R> = {
  /**
   * Set the return value for the current call.
   *
   * @param promise This needs to be a Promise wrapping the same type
   *   as the value returned by the call inside `when()`.
   *
   * @example
   * when(fn()).thenReturn(Promise.resolve(23));
   *
   * @example
   * when(fn()).thenReturn(Promise.reject({ foo: 'bar' });
   */
  thenReturn(promise: Promise<R>): InvocationCount;

  /**
   * Set the return value for the current call.
   *
   * @param promiseValue This needs to be of the same type as the value inside
   *   the promise returned by the call inside `when()`.
   */
  thenResolve(promiseValue: R): InvocationCount;

  /**
   * Make the current call reject with the given error.
   *
   * @param error An `Error` instance. If you want to reject with a non error
   *   then use the `thenReturn` method.
   */
  thenReject(error: Error): InvocationCount;

  /**
   * Make the current call reject with an error with the given message.
   *
   * @param message Will be wrapped in `new Error()`. If you want to reject
   *   with a custom error then use `thenReject`. If you want to reject with a
   *   non error then use `thenReturn`.
   */
  thenReject(message: string): InvocationCount;

  /**
   * Make the current call reject with `new Error()`.
   */
  thenReject(): InvocationCount;
};

type NonPromiseStub<R> = {
  /**
   * Set the return value for the current call.
   *
   * @param returnValue This needs to be of the same type as the value returned
   *   by the call inside `when()`.
   */
  thenReturn(returnValue: R): InvocationCount;

  /**
   * Make the current call throw the given error.
   */
  thenThrow(error: Error): InvocationCount;

  /**
   * Make the current call throw an error with the given message.
   *
   * @param message Will be wrapped in `new Error()`.
   */
  thenThrow(message: string): InvocationCount;

  /**
   * Make the current call throw `new Error()`.
   */
  thenThrow(): InvocationCount;
};

// Wrap T in a tuple to prevent distribution in case it's a union.
export type Stub<T> = [T] extends [Promise<infer U>]
  ? PromiseStub<U>
  : NonPromiseStub<T>;

/**
 * Set a return value for the currently pending expectation.
 */
const finishPendingExpectation = (
  returnValue: ReturnValue,
  pendingExpectation: PendingExpectation
) => {
  const finishedExpectation = pendingExpectation.finish(returnValue);
  pendingExpectation.clear();

  return createInvocationCount(finishedExpectation);
};

const getError = (errorOrMessage: Error | string | undefined): Error => {
  if (typeof errorOrMessage === 'string') {
    return new Error(errorOrMessage);
  }

  if (errorOrMessage instanceof Error) {
    return errorOrMessage;
  }

  return new Error();
};

export const createReturns = <R>(
  pendingExpectation: PendingExpectation
): Stub<R> => {
  const nonPromiseStub: NonPromiseStub<any> = {
    // TODO: merge this with the promise version
    thenReturn: /* istanbul ignore next: because this is overwritten by the promise version */ (
      returnValue: any
    ): InvocationCount =>
      finishPendingExpectation(
        { value: returnValue, isError: false, isPromise: false },
        pendingExpectation
      ),
    thenThrow: (errorOrMessage?: Error | string): InvocationCount =>
      finishPendingExpectation(
        { value: getError(errorOrMessage), isError: true, isPromise: false },
        pendingExpectation
      ),
  };

  const promiseStub: PromiseStub<any> = {
    thenReturn: (promise: Promise<any>): InvocationCount =>
      finishPendingExpectation(
        {
          value: promise,
          isError: false,
          // We're setting this to false because we can't distinguish between a
          // promise thenReturn and a normal thenReturn.
          isPromise: false,
        },
        pendingExpectation
      ),

    thenResolve: (promiseValue: any): InvocationCount =>
      finishPendingExpectation(
        {
          value: promiseValue,
          isError: false,
          isPromise: true,
        },
        pendingExpectation
      ),

    thenReject: (errorOrMessage?: Error | string): InvocationCount =>
      finishPendingExpectation(
        {
          value: getError(errorOrMessage),
          isError: true,
          isPromise: true,
        },
        pendingExpectation
      ),
  };

  // @ts-expect-error TODO: because the return type is a conditional and
  // we're doing something fishy here that TS doesn't like
  return { ...nonPromiseStub, ...promiseStub };
};
