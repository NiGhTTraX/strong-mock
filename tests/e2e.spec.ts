import { printExpected } from 'jest-matcher-utils';
import { It, Strictness, verify, when } from '../src';
import {
  UnexpectedAccess,
  UnexpectedCall,
  UnmetExpectations,
} from '../src/errors';
import { mock } from '../src/mock/mock';
import { expectAnsilessEqual } from './ansiless';
import { Fn } from './fixtures';

describe('e2e', () => {
  describe('function', () => {
    it('should set expectation to throw', () => {
      const fn = mock<() => void>();
      const error = new Error();

      when(() => fn()).thenThrow(error);

      expect(() => fn()).toThrow(error);
    });

    it('should set expectation with promise', async () => {
      const fn = mock<() => Promise<number>>();

      when(() => fn()).thenResolve(23);

      await expect(fn()).resolves.toEqual(23);
    });

    it('should set expectation with promise rejection', async () => {
      const fn = mock<() => Promise<number>>();

      when(() => fn()).thenReject('oops');

      await expect(fn()).rejects.toThrow('oops');
    });
  });

  describe('property', () => {
    it('should set expectation to throw', () => {
      const fn = mock<{ bar: () => void }>();
      const error = new Error();

      when(() => fn.bar()).thenThrow(error);

      expect(() => fn.bar()).toThrow(error);
    });

    it('should set expectation with promise', async () => {
      const fn = mock<{ bar: () => Promise<number> }>();

      when(() => fn.bar()).thenResolve(23);

      await expect(fn.bar()).resolves.toEqual(23);
    });

    it('should set expectation with promise rejection', async () => {
      const fn = mock<{ bar: () => Promise<number> }>();

      when(() => fn.bar()).thenReject('oops');

      await expect(fn.bar()).rejects.toThrow('oops');
    });
  });

  describe('interface', () => {
    it('should set expectation on method', () => {
      interface Foo {
        bar(x: number): number;
      }

      const foo = mock<Foo>();

      when(() => foo.bar(1)).thenReturn(23);

      expect(foo.bar(1)).toEqual(23);
    });

    it('should set expectation on method to throw', () => {
      interface Foo {
        bar(x: number): number;
      }

      const foo = mock<Foo>();
      when(() => foo.bar(1)).thenThrow();

      expect(() => foo.bar(1)).toThrow();
    });

    it('should set expectation on member', () => {
      interface Foo {
        bar: number;
      }

      const foo = mock<Foo>();

      when(() => foo.bar).thenReturn(23);

      expect(foo.bar).toEqual(23);
    });
  });

  it('should set expectation with invocation count', async () => {
    const fn = mock<() => number>();
    when(() => fn())
      .thenReturn(42)
      .between(2, 3);

    expect(fn()).toEqual(42);
    expect(() => verify(fn)).toThrow(UnmetExpectations);
    expect(fn()).toEqual(42);
    expect(() => verify(fn)).not.toThrow();
    expect(fn()).toEqual(42);
    expect(() => fn()).toThrow(UnexpectedCall);
  });

  it('should be stringifiable', () => {
    const fn = mock<() => void>();

    expect(fn.toString()).toEqual('mock');
    expectAnsilessEqual(printExpected(fn), '[Function mock]');
  });

  it('should be enumerable', () => {
    const foo = mock<{ bar: number; baz: number }>();
    when(() => foo.bar).thenReturn(42);

    expect(Object.keys(foo)).toEqual(['bar']);
    expect({ ...foo }).toEqual({ bar: 42 });
  });

  it('should not throw an unhandled rejection from an unmet promise expectation', () => {
    const fn = mock<() => Promise<number>>();

    when(() => fn()).thenReject(
      'if you are seeing this it means the test failed'
    );
  });

  it('should match other mocks', () => {
    const mock1 = mock<(x: any) => boolean>();
    const mock2 = mock();

    when(() => mock1(mock2)).thenReturn(true);

    expect(mock1(mock2)).toBeTruthy();
  });

  it('should configure strictness', () => {
    const foo = mock<{ bar: () => number }>({
      strictness: Strictness.SUPER_STRICT,
    });

    expect(() => foo.bar()).toThrow(UnexpectedAccess);
  });

  describe('ignoring arguments', () => {
    it('should support matching anything', () => {
      const fn = mock<Fn>();

      when(() => fn(1, It.isAny(), It.isAny())).thenReturn(23);

      expect(fn(1, 2, 3)).toEqual(23);
    });

    it('should support matching custom predicates', () => {
      const fn = mock<Fn>();

      when(() =>
        fn(
          1,
          It.matches((y) => y === 2),
          It.matches((z) => z === 3)
        )
      ).thenReturn(23);

      expect(fn(1, 2, 3)).toEqual(23);
    });

    it('should support deep matching objects', () => {
      const fn = mock<(x: { foo: { bar: string; baz: number } }) => number>();

      when(() => fn(It.isObject({ foo: { bar: 'bar' } }))).thenReturn(23);

      expect(() => fn({ foo: { bar: 'baz', baz: 42 } })).toThrow(
        UnexpectedCall
      );
      expect(fn({ foo: { bar: 'bar', baz: 42 } })).toEqual(23);
    });

    it('should capture arguments', () => {
      type Cb = (value: number) => number;

      const fn = mock<(cb: Cb) => number>();

      const matcher = It.willCapture<Cb>('test');
      when(() => fn(matcher)).thenReturn(42);

      expect(fn((x) => x + 1)).toEqual(42);

      expect(matcher.value?.(3)).toEqual(4);
    });
  });
});
