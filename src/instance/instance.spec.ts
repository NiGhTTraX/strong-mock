import { printExpected } from 'jest-matcher-utils';
import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { expectAnsilessEqual } from '../../tests/ansiless';
import { SM } from '../../tests/old';
import { ApplyProp } from '../expectation/expectation';
import { ExpectationRepository } from '../expectation/repository/expectation-repository';
import { instance } from '../index';
import { mock } from '../mock/mock';

describe('instance', () => {
  const repo = SM.mock<ExpectationRepository>();

  it('should get matching expectation for apply', () => {
    SM.when(repo.get(ApplyProp) as unknown).thenReturn(() => 42);

    const fn = mock<(x: number) => number>({ repository: SM.instance(repo) });

    expect(instance(fn)(1)).toEqual(42);
  });

  it('should get matching expectation for method', () => {
    SM.when(repo.get('bar') as unknown).thenReturn(() => 42);

    const foo = mock<{ bar: (x: number) => number }>({
      repository: SM.instance(repo),
    });

    expect(instance(foo).bar(1)).toEqual(42);
  });

  it('should get matching expectation for property', () => {
    SM.when(repo.get('bar') as unknown).thenReturn(42);

    const foo = mock<{ bar: number }>({ repository: SM.instance(repo) });

    expect(instance(foo).bar).toEqual(42);
  });

  it('should pretty print', () => {
    expectAnsilessEqual(
      printExpected(instance(mock<any>())),
      '[Function mock]'
    );
  });

  it('should be spreadable', () => {
    const baz = Symbol('baz');
    const keys = ['foo', 'bar', baz];

    SM.when(repo.getAllProperties()).thenReturn(keys).times(4);
    SM.when(repo.get('foo') as unknown).thenReturn(1);
    SM.when(repo.get('bar') as unknown).thenReturn(2);
    SM.when(repo.get(baz) as unknown).thenReturn(3);

    const foo = mock<{ foo: number; bar: number; [baz]: number }>({
      repository: SM.instance(repo),
    });

    expect({ ...instance(foo) }).toEqual({ foo: 1, bar: 2, [baz]: 3 });
  });
});
