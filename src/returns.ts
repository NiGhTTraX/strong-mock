import { InvocationCount, createInvocationCount } from './invocation-count';
import { PendingExpectation } from './pending-expectation';

type PromiseStub<R> = {
  returns(promise: Promise<R>): InvocationCount;
  resolves(returnValue: R): InvocationCount;

  rejects(error: Error): InvocationCount;
  rejects(message: string): InvocationCount;
  rejects(): InvocationCount;
};

type NonPromiseStub<R> = {
  returns(returnValue: R): InvocationCount;

  throws(error: Error): InvocationCount;
  throws(message: string): InvocationCount;
  throws(): InvocationCount;
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
    returns: (returnValue: any): InvocationCount => {
      // TODO: should probably fix this
      /* istanbul ignore next: because it will be overridden by
       * promiseStub and the types are compatible */
      return finishPendingExpectation(returnValue, pendingExpectation);
    },

    throws: (errorOrMessage?: Error | string): InvocationCount =>
      finishPendingExpectation(getError(errorOrMessage), pendingExpectation)
  };

  const promiseStub: PromiseStub<any> = {
    returns: (promise: Promise<any>): InvocationCount =>
      finishPendingExpectation(promise, pendingExpectation),

    resolves: (returnValue: any): InvocationCount =>
      finishPendingExpectation(
        Promise.resolve(returnValue),
        pendingExpectation
      ),

    rejects: (errorOrMessage?: Error | string): InvocationCount =>
      finishPendingExpectation(
        Promise.reject(getError(errorOrMessage)),
        pendingExpectation
      )
  };

  // @ts-ignore TODO: because the return type is a conditional and
  // we're doing something fishy here that TS doesn't like
  return { ...nonPromiseStub, ...promiseStub };
};
