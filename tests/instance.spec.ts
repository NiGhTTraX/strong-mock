import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { instance } from '../src';
import { ApplyProp } from '../src/expectation';
import { mock } from '../src/mock';
import { SpyRepository } from './expectation-repository';

describe('instance', () => {
  it('should get matching expectation for apply', () => {
    const repo = new SpyRepository(true, [() => 42]);
    const fn = mock<(x: number) => number>({ repository: repo });

    expect(instance(fn)(1)).toEqual(42);
    expect(repo.getCalledWith).toEqual([ApplyProp]);
  });

  it('should get matching expectation for method', () => {
    const repo = new SpyRepository(true, [() => 42]);
    const foo = mock<{ bar: (x: number) => number }>({ repository: repo });

    expect(instance(foo).bar(1)).toEqual(42);
    expect(repo.getCalledWith).toEqual(['bar']);
  });

  it('should get matching expectation for property', () => {
    const repo = new SpyRepository(true, [42]);
    const foo = mock<{ bar: number }>({ repository: repo });

    expect(instance(foo).bar).toEqual(42);
    expect(repo.getCalledWith).toEqual(['bar']);
  });
});
