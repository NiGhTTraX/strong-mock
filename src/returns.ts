import { createInvocationCount, InvocationCount } from './invocation-count';
import { PendingExpectation } from './pending-expectation';

type PromiseStub<R> = {
  thenReturn(promise: Promise<R>): InvocationCount;
  thenResolve(returnValue: R): InvocationCount;

  thenReject(error: Error): InvocationCount;
  thenReject(message: string): InvocationCount;
  thenReject(): InvocationCount;
};

type NonPromiseStub<R> = {
  thenReturn(returnValue: R): InvocationCount;

  thenThrow(error: Error): InvocationCount;
  thenThrow(message: string): InvocationCount;
  thenThrow(): InvocationCount;
};

export type Stub<T> = T extends Promise<infer U>
  ? PromiseStub<U>
  : NonPromiseStub<T>;

export const finishPendingExpectation = (
  returnValue: any,
  pendingExpectation: PendingExpectation
) => {
  const finishedExpectation = pendingExpectation.finish(returnValue);
  pendingExpectation.clear();

  return createInvocationCount(finishedExpectation);
};

const getError = (errorOrMessage: Error | string | undefined) => {
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

    thenResolve: (returnValue: any): InvocationCount =>
      finishPendingExpectation(
        Promise.resolve(returnValue),
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
