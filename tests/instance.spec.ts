import { printExpected } from 'jest-matcher-utils';
import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { instance } from '../src';
import { ApplyProp } from '../src/expectation/expectation';
import { mock } from '../src/mock/mock';
import { ExpectationRepository } from '../src/repository/expectation-repository';
import { expectAnsilessEqual } from './ansiless';
import { SM } from './old';

describe('instance', () => {
  const repo = SM.mock<ExpectationRepository>();

  it('should get matching expectation for apply', () => {
    const fn = mock<(x: number) => number>({ repository: SM.instance(repo) });

    SM.when(repo.get(ApplyProp) as unknown).thenReturn(() => 42);
    expect(instance(fn)(1)).toEqual(42);
  });

  it('should get matching expectation for method', () => {
    const foo = mock<{ bar: (x: number) => number }>({
      repository: SM.instance(repo),
    });

    SM.when(repo.get('bar') as unknown).thenReturn(() => 42);

    expect(instance(foo).bar(1)).toEqual(42);
  });

  it('should get matching expectation for property', () => {
    const foo = mock<{ bar: number }>({ repository: SM.instance(repo) });

    SM.when(repo.get('bar') as unknown).thenReturn(42);

    expect(instance(foo).bar).toEqual(42);
  });

  it('should pretty print', () => {
    expectAnsilessEqual(
      printExpected(instance(mock<any>())),
      '[Function mock]'
    );
  });
});
