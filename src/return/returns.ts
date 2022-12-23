import type { ExpectationRepository } from '../expectation/repository/expectation-repository';
import type { ReturnValue } from '../expectation/repository/return-value';
import type { PendingExpectation } from '../when/pending-expectation';
import type { InvocationCount } from './invocation-count';
import { createInvocationCount } from './invocation-count';

export type PromiseStub<R, P> = {
  /**
   * Set the return value for the current call.
   *
   * @param value This needs to be of the same type as the value returned
   *   by the call inside `when`.
   *
   * @example
   * when(() => fn()).thenReturn(Promise.resolve(23));
   *
   * @example
   * when(() => fn()).thenReturn(Promise.reject({ foo: 'bar' });
   */
  thenReturn(value: P): InvocationCount;

  /**
   * Set the return value for the current call.
   *
   * @param promiseValue This needs to be of the same type as the value inside
   *   the promise returned by the `when` callback.
   *
   * @example
   * when(() => fn()).thenResolve('foo');
   */
  thenResolve(promiseValue: R): InvocationCount;

  /**
   * Make the current call reject with the given error.
   *
   * @param error An `Error` instance. You can pass just a message, and
   *   it will be wrapped in an `Error` instance. If you want to reject with
   *   a non error then use the {@link thenReturn} method.
   *
   * @example
   * when(() => fn()).thenReject(new Error('oops'));
   */
  thenReject(error: Error): InvocationCount;

  /**
   * Make the current call reject with an error with the given message.
   *
   * @param message Will be wrapped in `new Error()`. If you want to reject
   *   with a custom error then pass it here instead of the message. If you
   *   want to reject with a non error then use `thenReturn`.
   *
   * @example
   * when(() => fn()).thenReject('oops');
   */
  thenReject(message: string): InvocationCount;

  /**
   * Make the current call reject with `new Error()`.
   */
  thenReject(): InvocationCount;
};

export type NonPromiseStub<R> = {
  /**
   * Set the return value for the current call.
   *
   * @param returnValue This needs to be of the same type as the value returned
   *   by the `when` callback.
   */
  thenReturn(returnValue: R): InvocationCount;

  /**
   * Make the current call throw the given error.
   *
   * @param error The error instance. If you want to throw a simple `Error`
   *   you can pass just the message.
   */
  thenThrow(error: Error): InvocationCount;

  /**
   * Make the current call throw an error with the given message.
   *
   * @param message Will be wrapped in `new Error()`. If you want to throw
   *   a custom error pass it here instead of the message.
   */
  thenThrow(message: string): InvocationCount;

  /**
   * Make the current call throw `new Error()`.
   */
  thenThrow(): InvocationCount;
};

const finishPendingExpectation = (
  returnValue: ReturnValue,
  pendingExpectation: PendingExpectation,
  repo: ExpectationRepository
) => {
  const finishedExpectation = pendingExpectation.finish(returnValue);

  repo.add(finishedExpectation);

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

export const createReturns = (
  pendingExpectation: PendingExpectation,
  repository: ExpectationRepository
) => ({
  thenReturn: (returnValue: any): InvocationCount =>
    finishPendingExpectation(
      // This will handle both thenReturn(23) and thenReturn(Promise.resolve(3)).
      { value: returnValue, isError: false, isPromise: false },
      pendingExpectation,
      repository
    ),
  thenThrow: (errorOrMessage?: Error | string): InvocationCount =>
    finishPendingExpectation(
      { value: getError(errorOrMessage), isError: true, isPromise: false },
      pendingExpectation,
      repository
    ),
  thenResolve: (promiseValue: any): InvocationCount =>
    finishPendingExpectation(
      {
        value: promiseValue,
        isError: false,
        isPromise: true,
      },
      pendingExpectation,
      repository
    ),

  thenReject: (errorOrMessage?: Error | string): InvocationCount =>
    finishPendingExpectation(
      {
        value: getError(errorOrMessage),
        isError: true,
        isPromise: true,
      },
      pendingExpectation,
      repository
    ),
});
