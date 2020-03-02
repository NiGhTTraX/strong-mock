import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { createReturns } from '../src/returns';
import { SpyPendingExpectation } from './expectations';

describe('returns', () => {
  it('should set a return value', () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<number>(pendingExpectation).thenReturn(23);

    expect(pendingExpectation.finishCalledWith).toEqual(23);
  });

  it('should set a custom exception', () => {
    const pendingExpectation = new SpyPendingExpectation();

    const error = new Error();
    createReturns<number>(pendingExpectation).thenThrow(error);

    expect(pendingExpectation.finishCalledWith).toEqual(error);
  });

  it('should set an empty exception', () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<number>(pendingExpectation).thenThrow();

    expect(pendingExpectation.finishCalledWith).toEqual(new Error());
  });

  it('should set a exception message', () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<number>(pendingExpectation).thenThrow('foobar');

    expect(pendingExpectation.finishCalledWith).toEqual(new Error('foobar'));
  });

  it('should set a return promise', async () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<Promise<number>>(pendingExpectation).thenReturn(
      Promise.resolve(23)
    );

    await expect(pendingExpectation.finishCalledWith).resolves.toEqual(23);
  });

  it('should set a return promise value', async () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<Promise<number>>(pendingExpectation).thenResolve(23);

    await expect(pendingExpectation.finishCalledWith).resolves.toEqual(23);
  });

  it('should set a custom promise rejection', async () => {
    const pendingExpectation = new SpyPendingExpectation();

    const error = new Error();
    createReturns<Promise<number>>(pendingExpectation).thenReject(error);

    await expect(pendingExpectation.finishCalledWith).rejects.toEqual(error);
  });

  it('should set an empty promise rejection', async () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<Promise<number>>(pendingExpectation).thenReject();

    await expect(pendingExpectation.finishCalledWith).rejects.toEqual(
      new Error()
    );
  });

  it('should set a promise rejection message', async () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<Promise<number>>(pendingExpectation).thenReject('foobar');

    await expect(pendingExpectation.finishCalledWith).rejects.toEqual(
      new Error('foobar')
    );
  });
});
