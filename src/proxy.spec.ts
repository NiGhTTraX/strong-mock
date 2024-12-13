import type { Bar, Fn, Foo } from '../tests/fixtures';
import { uniqueSymbol } from '../tests/fixtures';
import { SM } from '../tests/old';
import type { ProxyTraps } from './proxy';
import { createProxy } from './proxy';

describe('proxy', () => {
  const traps = SM.mock<ProxyTraps>();

  it('should trap fn(...args)', () => {
    SM.when(() => traps.apply([1, 2, 3])).thenReturn(42);

    const proxy = createProxy<Fn>(traps);

    expect(proxy(1, 2, 3)).toEqual(42);

    SM.verify(traps);
  });

  it('should trap fn.call(this, ...args)', () => {
    SM.when(() => traps.apply([1, 2, 3])).thenReturn(42);

    const proxy = createProxy<Fn>(traps);

    expect(proxy.call(null, 1, 2, 3)).toEqual(42);
  });

  it('should trap fn.call(this)', () => {
    SM.when(() => traps.apply([])).thenReturn(42);

    const proxy = createProxy<() => number>(traps);

    expect(proxy.call(null)).toEqual(42);
  });

  it('should trap fn.apply(this, [...args])', () => {
    SM.when(() => traps.apply([1, 2, 3])).thenReturn(42);

    const proxy = createProxy<Fn>(traps);

    expect(proxy.apply(null, [1, 2, 3])).toEqual(42);
  });

  it('should trap fn.apply(this)', () => {
    SM.when(() => traps.apply([])).thenReturn(42);

    const proxy = createProxy<() => number>(traps);

    expect(proxy.apply(null)).toEqual(42);
  });

  it('should trap Reflect.apply(fn, this, [...args])', () => {
    SM.when(() => traps.apply([1, 2, 3])).thenReturn(42);

    const proxy = createProxy<Fn>(traps);

    expect(Reflect.apply(proxy, null, [1, 2, 3])).toEqual(42);
  });

  it('should trap binding', () => {
    SM.when(() => traps.apply([1, 2, 3])).thenReturn(42);

    const proxy = createProxy<Fn>(traps);
    const bound = proxy.bind(null, 1, 2);

    expect(bound(3)).toEqual(42);
  });

  it('should trap foo.bar', () => {
    SM.when(() => traps.property('bar')).thenReturn('baz');

    const proxy = createProxy<Foo>(traps);

    expect(proxy.bar).toEqual('baz');
  });

  it('should trap foo[Symbol]', () => {
    SM.when(() => traps.property(uniqueSymbol)).thenReturn(42);

    const proxy = createProxy<Bar>(traps);

    expect(proxy[uniqueSymbol]).toEqual(42);
  });

  it('should trap foo[23]', () => {
    // Keys are coerced to strings.
    SM.when(() => traps.property('0')).thenReturn(1);

    const proxy = createProxy<[1, 2, 3]>(traps);

    expect(proxy[0]).toEqual(1);
  });

  it('should trap toString', () => {
    SM.when(() => traps.property('toString')).thenReturn(() => '1');
    SM.when(() => traps.property(Symbol.toStringTag)).thenReturn(() => '2');
    SM.when(() => traps.property('@@toStringTag')).thenReturn(() => '3');

    const proxy = createProxy<() => void>(traps);

    expect(proxy.toString()).toEqual('1');
    // @ts-expect-error because the proxy target type above can't be indexed
    expect(proxy[Symbol.toStringTag]()).toEqual('2');
    // @ts-expect-error because the proxy target type above can't be indexed
    expect(proxy['@@toStringTag']()).toEqual('3');
  });

  it('should trap the spread operator', () => {
    const c = Symbol('c');
    SM.when(() => traps.ownKeys())
      .thenReturn(['a', 'b', c])
      .times(4);
    SM.when(() => traps.property('a')).thenReturn(1);
    SM.when(() => traps.property('b')).thenReturn(2);
    SM.when(() => traps.property(c)).thenReturn(3);

    const proxy = createProxy<object>(traps);

    expect({ ...proxy }).toEqual({ a: 1, b: 2, [c]: 3 });
  });

  it('should trap Reflect.ownKeys', () => {
    const c = Symbol('c');
    SM.when(() => traps.ownKeys()).thenReturn(['a', 'b', c]);

    const proxy = createProxy<object>(traps);

    expect(Reflect.ownKeys(proxy)).toEqual(['a', 'b', c]);
  });

  it('should trap Object.keys', () => {
    SM.when(() => traps.ownKeys())
      .thenReturn(['a', 'b'])
      .times(3);

    const proxy = createProxy<object>(traps);

    expect(Object.keys(proxy)).toEqual(['a', 'b']);
  });

  it('should trap for..in', () => {
    SM.when(() => traps.ownKeys())
      .thenReturn(['a', 'b'])
      .times(3);

    const proxy = createProxy<object>(traps);

    const keys: string[] = [];

    for (const key in proxy) {
      // noinspection JSUnfilteredForInLoop
      keys.push(key);
    }

    expect(keys).toEqual(['a', 'b']);
  });

  it('should trap getOwnPropertyDescriptor', () => {
    SM.when(() => traps.ownKeys())
      .thenReturn(['foo'])
      .twice();

    const proxy = createProxy<object>(traps);

    expect(Object.getOwnPropertyDescriptor(proxy, 'foo')).toBeDefined();
    expect(Object.getOwnPropertyDescriptor(proxy, 'bar')).toBeUndefined();
  });
});
