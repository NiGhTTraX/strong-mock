import { SM } from '../../tests/old';
import { OneUseAlwaysMatchingExpectation } from '../expectation/expectation.mocks';
import type { ExpectationRepository } from '../expectation/repository/expectation-repository';
import type { ExpectationBuilder } from '../when/expectation-builder';
import { createReturns } from './returns';

describe('returns', () => {
  const expectation = new OneUseAlwaysMatchingExpectation();
  const builder = SM.mock<ExpectationBuilder>();
  const repo = SM.mock<ExpectationRepository>();

  beforeEach(() => {
    // noinspection JSVoidFunctionReturnValueUsed
    SM.when(() => repo.add(expectation)).thenReturn();
  });

  it('should set a return value', () => {
    SM.when(() =>
      builder.finish({
        value: 23,
        isError: false,
        isPromise: false,
      }),
    ).thenReturn(expectation);

    createReturns(builder, repo).thenReturn(23);
  });

  it('should set a custom exception', () => {
    const error = new Error();

    SM.when(() =>
      builder.finish({
        value: error,
        isError: true,
        isPromise: false,
      }),
    ).thenReturn(expectation);

    createReturns(builder, repo).thenThrow(error);
  });

  it('should set an empty exception', () => {
    SM.when(() =>
      builder.finish({
        value: new Error(),
        isError: true,
        isPromise: false,
      }),
    ).thenReturn(expectation);

    createReturns(builder, repo).thenThrow();
  });

  it('should set an exception message', () => {
    SM.when(() =>
      builder.finish({
        value: new Error('foobar'),
        isError: true,
        isPromise: false,
      }),
    ).thenReturn(expectation);

    createReturns(builder, repo).thenThrow('foobar');
  });

  it('should set a return promise', () => {
    const promise = Promise.resolve(23);

    SM.when(() =>
      builder.finish({
        value: promise,
        isError: false,
        isPromise: false,
      }),
    ).thenReturn(expectation);

    createReturns(builder, repo).thenReturn(promise);
  });

  it('should set a return promise value', () => {
    SM.when(() =>
      builder.finish({
        value: 23,
        isError: false,
        isPromise: true,
      }),
    ).thenReturn(expectation);

    createReturns(builder, repo).thenResolve(23);
  });

  it('should set a custom promise rejection', () => {
    const error = new Error();

    SM.when(() =>
      builder.finish({
        value: error,
        isError: true,
        isPromise: true,
      }),
    ).thenReturn(expectation);

    createReturns(builder, repo).thenReject(error);
  });

  it('should set an empty promise rejection', () => {
    SM.when(() =>
      builder.finish({
        value: new Error(),
        isError: true,
        isPromise: true,
      }),
    ).thenReturn(expectation);

    createReturns(builder, repo).thenReject();
  });

  it('should set a promise rejection message', () => {
    SM.when(() =>
      builder.finish({
        value: new Error('foobar'),
        isError: true,
        isPromise: true,
      }),
    ).thenReturn(expectation);

    createReturns(builder, repo).thenReject('foobar');
  });
});
