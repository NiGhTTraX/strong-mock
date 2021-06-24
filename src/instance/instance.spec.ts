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
    SM.when(repo.get(ApplyProp)).thenReturn({ value: () => 42 });

    const fn = mock<(x: number) => number>({ repository: SM.instance(repo) });

    expect(instance(fn)(1)).toEqual(42);
  });

  it('should get matching expectation for method', () => {
    SM.when(repo.get('bar')).thenReturn({ value: () => 42 });

    const foo = mock<{ bar: (x: number) => number }>({
      repository: SM.instance(repo),
    });

    expect(instance(foo).bar(1)).toEqual(42);
  });

  it('should get matching expectation for property', () => {
    SM.when(repo.get('bar')).thenReturn({ value: 42 });

    const foo = mock<{ bar: number }>({ repository: SM.instance(repo) });

    expect(instance(foo).bar).toEqual(42);
  });

  it('should throw matching property error expectation', () => {
    SM.when(repo.get('bar')).thenReturn({ value: 'foo', isError: true });

    const foo = mock<{ bar: number }>({ repository: SM.instance(repo) });

    expect(() => instance(foo).bar).toThrow('foo');
  });

  it('should resolve matching property promise expectation', async () => {
    SM.when(repo.get('bar')).thenReturn({ value: 'foo', isPromise: true });

    const foo = mock<{ bar: number }>({ repository: SM.instance(repo) });

    await expect(instance(foo).bar).resolves.toEqual('foo');
  });

  it('should reject matching property error promise expectation', async () => {
    SM.when(repo.get('bar')).thenReturn({
      value: new Error('foo'),
      isPromise: true,
      isError: true,
    });

    const foo = mock<{ bar: number }>({ repository: SM.instance(repo) });

    await expect(instance(foo).bar).rejects.toThrow('foo');
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
    SM.when(repo.get('foo')).thenReturn({ value: 1 });
    SM.when(repo.get('bar')).thenReturn({ value: 2 });
    SM.when(repo.get(baz)).thenReturn({ value: 3 });

    const foo = mock<{ foo: number; bar: number; [baz]: number }>({
      repository: SM.instance(repo),
    });

    expect({ ...instance(foo) }).toEqual({ foo: 1, bar: 2, [baz]: 3 });
  });
});
