import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { instance } from '../src';
import { UnexpectedAccess, UnexpectedCall } from '../src/errors';
import { ApplyProp } from '../src/expectation';
import { mock } from '../src/mock';
import { EmptyRepository, SpyRepository } from './expectation-repository';
import {
  OneUseAlwaysMatchingExpectation,
  SingleUseExpectationWithReturn,
} from './expectations';

describe('instance', () => {
  it('should get matching expectation for apply', () => {
    const repo = new SpyRepository(true, [
      new OneUseAlwaysMatchingExpectation(),
    ]);
    const fn = mock<(x: number) => number>({ repository: repo });

    expect(instance(fn)(1)).toEqual(42);
    expect(repo.getCalledWith).toEqual([ApplyProp, [1]]);
  });

  it('should get matching expectation for method', () => {
    const repo = new SpyRepository(true, [
      undefined,
      new SingleUseExpectationWithReturn(42),
    ]);
    const foo = mock<{ bar: (x: number) => number }>({ repository: repo });

    expect(instance(foo).bar(1)).toEqual(42);
    expect(repo.getCalledWith).toEqual(['bar', [1]]);
  });

  it('should get matching expectation for property', () => {
    const repo = new SpyRepository(true, [
      new SingleUseExpectationWithReturn(42),
    ]);
    const foo = mock<{ bar: number }>({ repository: repo });

    expect(instance(foo).bar).toEqual(42);
    expect(repo.getCalledWith).toEqual(['bar', undefined]);
  });

  it('should throw if no expectation for property', () => {
    const foo = mock<{ bar: number }>({ repository: new EmptyRepository() });

    expect(() => instance(foo).bar).toThrow(UnexpectedAccess);
  });

  it('should throw if no expectation for method', () => {
    const foo = mock<{ bar: () => void }>({
      repository: new EmptyRepository(),
    });

    expect(() => instance(foo).bar()).toThrow(UnexpectedAccess);
  });

  it('should throw if no matching expectations', () => {
    const foo = mock<{ bar: () => void }>({
      repository: new SpyRepository(true, [undefined, undefined]),
    });

    expect(() => instance(foo).bar()).toThrow(UnexpectedCall);
  });

  it('should get matching expectation for property before method', () => {
    const repo = new SpyRepository(true, [
      // First call fins a property expectation.
      new SingleUseExpectationWithReturn(() => 1),
      // Second call doesn't find a property expectation.
      undefined,
      // Third call finds a method expectation.
      new SingleUseExpectationWithReturn(2),
    ]);
    const foo = mock<{ bar: (x: string) => number }>({ repository: repo });

    expect(instance(foo).bar(':irrelevant:')).toEqual(1);
    expect(instance(foo).bar(':irrelevant:')).toEqual(2);

    expect(repo.hasForCalledWith).toEqual('bar');
  });
});
