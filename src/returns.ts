import { createInvocationCount, InvocationCount } from './invocation-count';
import { PendingExpectation } from './pending-expectation';

type PromiseStub<R> = {
  /**
   * Set the return value for the current call.
   *
   * @param promise This needs to be a Promise wrapping the same type
   *   as the value returned by the call inside `when()`.
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
   */
  thenReject(error: Error): InvocationCount;

  /**
   * Make the current call reject with an error with the given message.
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
export const finishPendingExpectation = (
  returnValue: any,
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
    thenReturn: (returnValue: any): InvocationCount => {
      // TODO: should probably fix this
      /* istanbul ignore next: because it will be overridden by
       * promiseStub and the types are compatible */
      return finishPendingExpectation(returnValue, pendingExpectation);
    },

    thenThrow: (errorOrMessage?: Error | string): InvocationCount =>
      finishPendingExpectation(getError(errorOrMessage), pendingExpectation)
  };

  const promiseStub: PromiseStub<any> = {
    thenReturn: (promise: Promise<any>): InvocationCount =>
      finishPendingExpectation(promise, pendingExpectation),

    thenResolve: (promiseValue: any): InvocationCount =>
      finishPendingExpectation(
        Promise.resolve(promiseValue),
        pendingExpectation
      ),

    thenReject: (errorOrMessage?: Error | string): InvocationCount =>
      finishPendingExpectation(
        Promise.reject(getError(errorOrMessage)),
        pendingExpectation
      )
  };

  // @ts-ignore TODO: because the return type is a conditional and
  // we're doing something fishy here that TS doesn't like
  return { ...nonPromiseStub, ...promiseStub };
};
