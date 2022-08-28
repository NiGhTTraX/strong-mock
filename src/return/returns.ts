import { ReturnValue } from '../expectation/repository/return-value';
import { ExpectationRepository } from '../expectation/repository/expectation-repository';
import { PendingExpectation } from '../when/pending-expectation';
import { createInvocationCount, InvocationCount } from './invocation-count';

type PromiseStub<R, P> = {
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
   *   with a custom error then pass it here instead of the message. If you
   *   want to reject with a non error then use `thenReturn`.
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

// Wrap T in a tuple to prevent distribution in case it's a union.
export type Stub<T> = [T] extends [Promise<infer U>]
  ? PromiseStub<U, T>
  : NonPromiseStub<T>;

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

export const createReturns = <R>(
  pendingExpectation: PendingExpectation,
  repository: ExpectationRepository
): Stub<R> => {
  const nonPromiseStub: NonPromiseStub<any> = {
    // TODO: merge this with the promise version
    thenReturn:
      /* istanbul ignore next: because this is overwritten by the promise version */ (
        returnValue: any
      ): InvocationCount =>
        finishPendingExpectation(
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
  };

  const promiseStub: PromiseStub<any, any> = {
    thenReturn: (promise: Promise<any>): InvocationCount =>
      finishPendingExpectation(
        {
          value: promise,
          isError: false,
          // We're setting this to false because we can't distinguish between a
          // promise thenReturn and a normal thenReturn.
          isPromise: false,
        },
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
  };

  // @ts-expect-error because the return type is a conditional, and we're merging
  // both branches here
  return { ...nonPromiseStub, ...promiseStub };
};
