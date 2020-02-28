import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { createProxy } from '../src/proxy';
import { Bar, Fn, Foo, uniqueSymbol } from './fixtures';

describe('proxy', () => {
  it('should trap fn(...args)', () => {
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

  it('should trap fn.call(this, ...args)', () => {
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

  it('should trap fn.apply(this, [...args])', () => {
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

  it('should trap Reflect.apply(fn, this, [...args])', () => {
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

  it('should trap binding', () => {
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

  it('should trap foo.bar', () => {
    let prop;

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

  it('should trap foo[Symbol]', () => {
    let prop;

    const proxy = createProxy<Bar>({
      property: property => {
        prop = property;
      },
      apply: () => {
        throw new Error('should not be called');
      }
    });

    proxy[uniqueSymbol]++;

    expect(prop).toEqual(uniqueSymbol);
  });

  it('should trap foo[23]', () => {
    let prop;

    const proxy = createProxy<[1, 2, 3]>({
      property: property => {
        prop = property;
      },
      apply: () => {
        throw new Error('should not be called');
      }
    });

    proxy[0]++;

    // TODO: the returned key is a string, but the original is a number
    expect(prop).toEqual('0');
  });
});
