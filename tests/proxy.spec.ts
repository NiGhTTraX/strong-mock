import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { createProxy } from '../src/proxy';

describe('proxy', () => {
  it('should call on fn(...args)', () => {
    let args: number[] = [];

    const proxy = createProxy<(x: number, y: number, z: number) => void>({
      property: () => {},
      method: () => {},
      apply: argArray => {
        args = argArray;
      }
    });

    proxy(1, 2, 3);

    expect(args).toEqual([1, 2, 3]);
  });

  it('should call on fn.call(this, ...args)', () => {
    let args: number[] = [];

    const proxy = createProxy<(x: number, y: number, z: number) => void>({
      property: () => {
        throw new Error('should not be called');
      },
      method: () => {},
      apply: argArray => {
        args = argArray;
      }
    });

    proxy.call(null, 1, 2, 3);

    expect(args).toEqual([1, 2, 3]);
  });

  it('should call on fn.apply(this, [...args])', () => {
    let args: number[] = [];

    const proxy = createProxy<(x: number, y: number, z: number) => void>({
      property: () => {
        throw new Error('should not be called');
      },
      method: () => {},
      apply: argArray => {
        args = argArray;
      }
    });

    proxy.apply(null, [1, 2, 3]);

    expect(args).toEqual([1, 2, 3]);
  });

  it('should call on Reflect.apply(fn, this, [...args])', () => {
    let args: number[] = [];

    const proxy = createProxy<(x: number, y: number, z: number) => void>({
      property: () => {
        throw new Error('should not be called');
      },
      method: () => {},
      apply: argArray => {
        args = argArray;
      }
    });

    Reflect.apply(proxy, null, [1, 2, 3]);

    expect(args).toEqual([1, 2, 3]);
  });

  it('should call on foo.bar(...args)', () => {
    let args: number[] = [];
    let callProp = '';
    let getProp = '';

    const proxy = createProxy<{
      bar: (x: number, y: number, z: number) => void;
    }>({
      property: property => {
        getProp = property;
      },
      method: (argArray, property) => {
        args = argArray;
        callProp = property;
      },
      apply: () => {}
    });

    proxy.bar(1, 2, 3);

    expect(args).toEqual([1, 2, 3]);
    expect(callProp).toEqual('bar');
    expect(getProp).toEqual('bar');
  });

  it('should call on foo.bar.call(this, ...args)', () => {
    let args: number[] = [];
    let callProp = '';
    let getProp = '';

    const proxy = createProxy<{
      bar: (x: number, y: number, z: number) => void;
    }>({
      property: property => {
        getProp = property;
      },
      method: (argArray, property) => {
        args = argArray;
        callProp = property;
      },
      apply: () => {}
    });

    proxy.bar.call(null, 1, 2, 3);

    expect(args).toEqual([1, 2, 3]);
    expect(callProp).toEqual('bar');
    expect(getProp).toEqual('bar');
  });
});
