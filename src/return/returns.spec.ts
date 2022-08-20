import { SM } from '../../tests/old';
import { OneUseAlwaysMatchingExpectation } from '../expectation/expectation.mocks';
import { ExpectationRepository } from '../expectation/repository/expectation-repository';
import { PendingExpectation } from '../when/pending-expectation';
import { createReturns } from './returns';

describe('returns', () => {
  const expectation = new OneUseAlwaysMatchingExpectation();
  const pendingExpectation = SM.mock<PendingExpectation>();
  const repo = SM.mock<ExpectationRepository>();

  beforeEach(() => {
    // noinspection JSVoidFunctionReturnValueUsed
    SM.when(repo.add(expectation)).thenReturn();
  });

  it('should set a return value', () => {
    SM.when(
      pendingExpectation.finish({
        value: 23,
        isError: false,
        isPromise: false,
      })
    ).thenReturn(expectation);

    createReturns<number>(
      SM.instance(pendingExpectation),
      SM.instance(repo)
    ).thenReturn(23);
  });

  it('should set a custom exception', () => {
    const error = new Error();

    SM.when(
      pendingExpectation.finish({
        value: error,
        isError: true,
        isPromise: false,
      })
    ).thenReturn(expectation);

    createReturns<number>(
      SM.instance(pendingExpectation),
      SM.instance(repo)
    ).thenThrow(error);
  });

  it('should set an empty exception', () => {
    SM.when(
      pendingExpectation.finish({
        value: new Error(),
        isError: true,
        isPromise: false,
      })
    ).thenReturn(expectation);

    createReturns<number>(
      SM.instance(pendingExpectation),
      SM.instance(repo)
    ).thenThrow();
  });

  it('should set an exception message', () => {
    SM.when(
      pendingExpectation.finish({
        value: new Error('foobar'),
        isError: true,
        isPromise: false,
      })
    ).thenReturn(expectation);

    createReturns<number>(
      SM.instance(pendingExpectation),
      SM.instance(repo)
    ).thenThrow('foobar');
  });

  it('should set a return promise', async () => {
    const promise = Promise.resolve(23);

    SM.when(
      pendingExpectation.finish({
        value: promise,
        isError: false,
        isPromise: false,
      })
    ).thenReturn(expectation);

    createReturns<Promise<number>>(
      SM.instance(pendingExpectation),
      SM.instance(repo)
    ).thenReturn(promise);
  });

  it('should set a return promise value', () => {
    SM.when(
      pendingExpectation.finish({
        value: 23,
        isError: false,
        isPromise: true,
      })
    ).thenReturn(expectation);

    createReturns<Promise<number>>(
      SM.instance(pendingExpectation),
      SM.instance(repo)
    ).thenResolve(23);
  });

  it('should set a custom promise rejection', () => {
    const error = new Error();

    SM.when(
      pendingExpectation.finish({
        value: error,
        isError: true,
        isPromise: true,
      })
    ).thenReturn(expectation);

    createReturns<Promise<number>>(
      SM.instance(pendingExpectation),
      SM.instance(repo)
    ).thenReject(error);
  });

  it('should set an empty promise rejection', () => {
    SM.when(
      pendingExpectation.finish({
        value: new Error(),
        isError: true,
        isPromise: true,
      })
    ).thenReturn(expectation);

    createReturns<Promise<number>>(
      SM.instance(pendingExpectation),
      SM.instance(repo)
    ).thenReject();
  });

  it('should set a promise rejection message', () => {
    SM.when(
      pendingExpectation.finish({
        value: new Error('foobar'),
        isError: true,
        isPromise: true,
      })
    ).thenReturn(expectation);

    createReturns<Promise<number>>(
      SM.instance(pendingExpectation),
      SM.instance(repo)
    ).thenReject('foobar');
  });
});
