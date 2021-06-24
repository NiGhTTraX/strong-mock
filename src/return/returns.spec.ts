import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { ReturnValue } from '../expectation/expectation';
import { createReturns } from './returns';
import { SpyPendingExpectation } from '../expectation/expectation.mocks';

describe('returns', () => {
  it('should set a return value', () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<number>(pendingExpectation).thenReturn(23);

    expect(pendingExpectation.finishCalledWith).toEqual({
      value: 23,
      isError: false,
      isPromise: false,
    });
  });

  it('should set a custom exception', () => {
    const pendingExpectation = new SpyPendingExpectation();

    const error = new Error();
    createReturns<number>(pendingExpectation).thenThrow(error);

    expect(pendingExpectation.finishCalledWith).toEqual({
      value: error,
      isError: true,
      isPromise: false,
    });
  });

  it('should set an empty exception', () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<number>(pendingExpectation).thenThrow();

    expect(pendingExpectation.finishCalledWith).toEqual({
      value: new Error(),
      isError: true,
      isPromise: false,
    });
  });

  it('should set an exception message', () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<number>(pendingExpectation).thenThrow('foobar');

    expect(pendingExpectation.finishCalledWith).toEqual({
      value: new Error('foobar'),
      isError: true,
      isPromise: false,
    });
  });

  it('should set a return promise', async () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<Promise<number>>(pendingExpectation).thenReturn(
      Promise.resolve(23)
    );

    await expect(pendingExpectation.finishCalledWith?.value).resolves.toEqual(
      23
    );
    expect(pendingExpectation.finishCalledWith).toMatchObject({
      isError: false,
      isPromise: false,
    });
  });

  it('should set a return promise value', () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<Promise<number>>(pendingExpectation).thenResolve(23);

    expect(pendingExpectation.finishCalledWith?.value).toEqual(23);
    expect(pendingExpectation.finishCalledWith).toMatchObject<
      Partial<ReturnValue>
    >({
      promiseValue: 23,
      isError: false,
      isPromise: true,
    });
  });

  it('should set a custom promise rejection', () => {
    const pendingExpectation = new SpyPendingExpectation();

    const error = new Error();
    createReturns<Promise<number>>(pendingExpectation).thenReject(error);

    expect(pendingExpectation.finishCalledWith?.value).toEqual(error);
    expect(pendingExpectation.finishCalledWith).toMatchObject<
      Partial<ReturnValue>
    >({
      promiseValue: error,
      isError: true,
      isPromise: true,
    });
  });

  it('should set an empty promise rejection', () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<Promise<number>>(pendingExpectation).thenReject();

    expect(pendingExpectation.finishCalledWith?.value).toEqual(new Error());
    expect(pendingExpectation.finishCalledWith).toMatchObject<
      Partial<ReturnValue>
    >({
      promiseValue: new Error(),
      isError: true,
      isPromise: true,
    });
  });

  it('should set a promise rejection message', () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<Promise<number>>(pendingExpectation).thenReject('foobar');

    expect(pendingExpectation.finishCalledWith?.value).toEqual(
      new Error('foobar')
    );
    expect(pendingExpectation.finishCalledWith).toMatchObject<
      Partial<ReturnValue>
    >({
      promiseValue: new Error('foobar'),
      isError: true,
      isPromise: true,
    });
  });
});
