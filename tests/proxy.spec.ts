import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { createProxy } from '../src/proxy';

describe('proxy', () => {
  type Fn = (x: number, y: number, z: number) => void;

  interface Foo {
    bar: Fn;
  }

  it('should call on fn(...args)', () => {
    let args: number[] = [];

    const proxy = createProxy<Fn>({
      property: () => {
        throw new Error('should not be called');
      },
      apply: argArray => {
        args = argArray;
      }
    });

    proxy(1, 2, 3);

    expect(args).toEqual([1, 2, 3]);
  });

  it('should call on fn.call(this, ...args)', () => {
    let args: number[] = [];

    const proxy = createProxy<Fn>({
      property: () => {
        throw new Error('should not be called');
      },
      apply: argArray => {
        args = argArray;
      }
    });

    proxy.call(null, 1, 2, 3);

    expect(args).toEqual([1, 2, 3]);
  });

  it('should call on fn.apply(this, [...args])', () => {
    let args: number[] = [];

    const proxy = createProxy<Fn>({
      property: () => {
        throw new Error('should not be called');
      },
      apply: argArray => {
        args = argArray;
      }
    });

    proxy.apply(null, [1, 2, 3]);

    expect(args).toEqual([1, 2, 3]);
  });

  it('should call on Reflect.apply(fn, this, [...args])', () => {
    let args: number[] = [];

    const proxy = createProxy<Fn>({
      property: () => {
        throw new Error('should not be called');
      },
      apply: argArray => {
        args = argArray;
      }
    });

    Reflect.apply(proxy, null, [1, 2, 3]);

    expect(args).toEqual([1, 2, 3]);
  });

  it('should call after binding', () => {
    let args: number[] = [];

    const proxy = createProxy<Fn>({
      property: () => {
        throw new Error('should not be called');
      },
      apply: argArray => {
        args = argArray;
      }
    });

    const bound = proxy.bind(null, 1, 2);
    bound(3);

    expect(args).toEqual([1, 2, 3]);
  });

  it('should call on foo.bar', () => {
    let prop = '';

    const proxy = createProxy<Foo>({
      property: property => {
        prop = property;
      },
      apply: () => {
        throw new Error('should not be called');
      }
    });

    proxy.bar;

    expect(prop).toEqual('bar');
  });
});
