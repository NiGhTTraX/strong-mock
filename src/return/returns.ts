import type { ExpectationRepository } from '../expectation/repository/expectation-repository.js';
import type { ReturnValue } from '../expectation/repository/return-value.js';
import type { ExpectationBuilder } from '../when/expectation-builder.js';
import type { InvocationCount } from './invocation-count.js';
import { createInvocationCount } from './invocation-count.js';

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
  thenReturn: (value: P) => InvocationCount;

  /**
   * Set the return value for the current call.
   *
   * @param promiseValue This needs to be of the same type as the value inside
   *   the promise returned by the `when` callback.
   *
   * @example
   * when(() => fn()).thenResolve('foo');
   */
  thenResolve: (promiseValue: R) => InvocationCount;

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
  thenReject: ((error: Error) => InvocationCount) &
    ((message: string) => InvocationCount) &
    (() => InvocationCount);
};

export type NonPromiseStub<R> = {
  /**
   * Set the return value for the current call.
   *
   * @param returnValue This needs to be of the same type as the value returned
   *   by the `when` callback.
   */
  thenReturn: (returnValue: R) => InvocationCount;

  /**
   * Make the current call throw the given error.
   *
   * @param error The error instance. If you want to throw a simple `Error`
   *   you can pass just the message.
   */
  thenThrow: ((error: Error) => InvocationCount) &
    ((message: string) => InvocationCount) &
    (() => InvocationCount);
};

const finishExpectation = (
  returnValue: ReturnValue,
  builder: ExpectationBuilder,
  repo: ExpectationRepository,
) => {
  const finishedExpectation = builder.finish(returnValue);

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
  builder: ExpectationBuilder,
  repository: ExpectationRepository,
) => ({
  thenReturn: (returnValue: any): InvocationCount =>
    finishExpectation(
      // This will handle both thenReturn(23) and thenReturn(Promise.resolve(3)).
      { value: returnValue, isError: false, isPromise: false },
      builder,
      repository,
    ),
  thenThrow: (errorOrMessage?: Error | string): InvocationCount =>
    finishExpectation(
      { value: getError(errorOrMessage), isError: true, isPromise: false },
      builder,
      repository,
    ),
  thenResolve: (promiseValue: any): InvocationCount =>
    finishExpectation(
      {
        value: promiseValue,
        isError: false,
        isPromise: true,
      },
      builder,
      repository,
    ),

  thenReject: (errorOrMessage?: Error | string): InvocationCount =>
    finishExpectation(
      {
        value: getError(errorOrMessage),
        isError: true,
        isPromise: true,
      },
      builder,
      repository,
    ),
});
