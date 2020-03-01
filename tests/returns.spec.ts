import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { createReturns } from '../src/returns';
import { SpyPendingExpectation } from './expectations';

describe('returns', () => {
  it('should set a return value', () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<number>(pendingExpectation).returns(23);

    expect(pendingExpectation.finishCalledWith).toEqual(23);
  });

  it('should set a custom exception', () => {
    const pendingExpectation = new SpyPendingExpectation();

    const error = new Error();
    createReturns<number>(pendingExpectation).throws(error);

    expect(pendingExpectation.finishCalledWith).toEqual(error);
  });

  it('should set an empty exception', () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<number>(pendingExpectation).throws();

    expect(pendingExpectation.finishCalledWith).toEqual(new Error());
  });

  it('should set a exception message', () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<number>(pendingExpectation).throws('foobar');

    expect(pendingExpectation.finishCalledWith).toEqual(new Error('foobar'));
  });

  it('should set a return promise', async () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<Promise<number>>(pendingExpectation).returns(
      Promise.resolve(23)
    );

    await expect(pendingExpectation.finishCalledWith).resolves.toEqual(23);
  });

  it('should set a return promise value', async () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<Promise<number>>(pendingExpectation).resolves(23);

    await expect(pendingExpectation.finishCalledWith).resolves.toEqual(23);
  });

  it('should set a custom promise rejection', async () => {
    const pendingExpectation = new SpyPendingExpectation();

    const error = new Error();
    createReturns<Promise<number>>(pendingExpectation).rejects(error);

    await expect(pendingExpectation.finishCalledWith).rejects.toEqual(error);
  });

  it('should set an empty promise rejection', async () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<Promise<number>>(pendingExpectation).rejects();

    await expect(pendingExpectation.finishCalledWith).rejects.toEqual(
      new Error()
    );
  });

  it('should set a promise rejection message', async () => {
    const pendingExpectation = new SpyPendingExpectation();

    createReturns<Promise<number>>(pendingExpectation).rejects('foobar');

    await expect(pendingExpectation.finishCalledWith).rejects.toEqual(
      new Error('foobar')
    );
  });
});
