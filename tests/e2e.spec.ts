import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { It, verify, when } from '../src';
import { UnexpectedCall, UnmetExpectations } from '../src/errors';
import { instance } from '../src/instance/instance';
import { mock } from '../src/mock/mock';
import { Fn } from './fixtures';

describe('e2e', () => {
  describe('function', () => {
    it('should set expectation to throw', () => {
      const fn = mock<() => void>();
      const error = new Error();

      when(fn()).thenThrow(error);

      expect(() => instance(fn)()).toThrow(error);
    });

    it('should set expectation with promise', async () => {
      const fn = mock<() => Promise<number>>();

      when(fn()).thenResolve(23);

      await expect(instance(fn)()).resolves.toEqual(23);
    });

    it('should set expectation with promise rejection', async () => {
      const fn = mock<() => Promise<number>>();

      when(fn()).thenReject('oops');

      await expect(instance(fn)()).rejects.toThrow('oops');
    });
  });

  describe('property', () => {
    it('should set expectation to throw', () => {
      const fn = mock<{ bar: () => void }>();
      const error = new Error();

      when(fn.bar()).thenThrow(error);

      expect(() => instance(fn).bar()).toThrow(error);
    });

    it('should set expectation with promise', async () => {
      const fn = mock<{ bar: () => Promise<number> }>();

      when(fn.bar()).thenResolve(23);

      await expect(instance(fn).bar()).resolves.toEqual(23);
    });

    it('should set expectation with promise rejection', async () => {
      const fn = mock<{ bar: () => Promise<number> }>();

      when(fn.bar()).thenReject('oops');

      await expect(instance(fn).bar()).rejects.toThrow('oops');
    });
  });

  describe('interface', () => {
    it('should set expectation on method', () => {
      interface Foo {
        bar(x: number): number;
      }

      const foo = mock<Foo>();

      when(foo.bar(1)).thenReturn(23);

      expect(instance(foo).bar(1)).toEqual(23);
    });

    it('should set expectation on method to throw', () => {
      interface Foo {
        bar(x: number): number;
      }

      const foo = mock<Foo>();
      when(foo.bar(1)).thenThrow();

      expect(() => instance(foo).bar(1)).toThrow();
    });

    it('should set expectation on member', () => {
      interface Foo {
        bar: number;
      }

      const foo = mock<Foo>();

      when(foo.bar).thenReturn(23);

      expect(instance(foo).bar).toEqual(23);
    });
  });

  it('should set expectation with invocation count', async () => {
    const fn = mock<() => void>();
    when(fn()).thenReturn(undefined).between(2, 3);

    expect(instance(fn)()).toEqual(undefined);
    expect(() => verify(fn)).toThrow(UnmetExpectations);
    expect(instance(fn)()).toEqual(undefined);
    expect(() => verify(fn)).not.toThrow();
    expect(instance(fn)()).toEqual(undefined);
    expect(() => instance(fn)()).toThrow(UnexpectedCall);
  });

  it('should be stringifiable', () => {
    expect(instance(mock<() => void>()).toString()).toEqual('mock');
  });

  it('should be enumerable', () => {
    const foo = mock<{ bar: number; baz: number }>();
    when(foo.bar).thenReturn(42);

    expect(Object.keys(instance(foo))).toEqual(['bar']);
    expect({ ...instance(foo) }).toEqual({ bar: 42 });
  });

  it('should not throw an unhandled rejection from an unmet promise expectation', () => {
    const fn = mock<() => Promise<number>>();

    when(fn()).thenReject('if you are seeing this it means the test failed');
  });

  it('should match other mocks', () => {
    const mock1 = mock<(x: any) => boolean>();
    // This one has to be an instance to be used in expectations.
    const mock2 = instance(mock());

    when(mock1(mock2)).thenReturn(true);

    expect(instance(mock1)(mock2)).toBeTruthy();
  });

  describe('ignoring arguments', () => {
    it('should support matching anything', () => {
      const fn = mock<Fn>();

      when(fn(1, It.isAny(), It.isAny())).thenReturn(23);

      expect(instance(fn)(1, 2, 3)).toEqual(23);
    });

    it('should support matching custom predicates', () => {
      const fn = mock<Fn>();

      when(
        fn(
          1,
          It.matches((y) => y === 2),
          It.matches((z) => z === 3)
        )
      ).thenReturn(23);

      expect(instance(fn)(1, 2, 3)).toEqual(23);
    });

    it('should support deep matching objects', () => {
      const fn = mock<(x: { foo: { bar: string; baz: number } }) => number>();

      when(fn(It.isObject({ foo: { bar: 'bar' } }))).thenReturn(23);

      expect(() => instance(fn)({ foo: { bar: 'baz', baz: 42 } })).toThrow(
        UnexpectedCall
      );
      expect(instance(fn)({ foo: { bar: 'bar', baz: 42 } })).toEqual(23);
    });

    it('should capture arguments', () => {
      type Cb = (value: number) => number;

      const fn = mock<(cb: Cb) => number>();

      const matcher = It.willCapture<Cb>('test');
      when(fn(matcher)).thenReturn(42);

      expect(instance(fn)((x) => x + 1)).toEqual(42);

      expect(matcher.value?.(3)).toEqual(4);
    });
  });
});
