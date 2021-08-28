import { isEqual } from './equal';

describe('isEqual', () => {
  it('should match primitives', () => {
    expect(isEqual(1, 1)).toBeTruthy();
    expect(isEqual(1, 2)).toBeFalsy();

    expect(isEqual(1.0, 1.0)).toBeTruthy();
    expect(isEqual(1.0, 1.1)).toBeFalsy();

    expect(isEqual(true, true)).toBeTruthy();
    expect(isEqual(true, false)).toBeFalsy();

    expect(isEqual('a', 'a')).toBeTruthy();
    expect(isEqual('a', 'b')).toBeFalsy();
  });

  it('should match arrays', () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBeTruthy();
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBeFalsy();
    expect(isEqual([1, 2, 3], [2, 3])).toBeFalsy();
  });

  it('should match objects', () => {
    expect(isEqual({ foo: 'bar' }, { foo: 'bar' })).toBeTruthy();
    expect(isEqual({ foo: 'bar' }, { foo: 'baz' })).toBeFalsy();
    expect(isEqual({ foo: 'bar' }, {})).toBeFalsy();
    expect(isEqual({}, { foo: 'bar' })).toBeFalsy();
  });

  it('should match nested objects', () => {
    expect(
      isEqual({ foo: { bar: 'baz' } }, { foo: { bar: 'baz' } })
    ).toBeTruthy();
    expect(
      isEqual({ foo: { bar: 'baz' } }, { foo: { bar: 'boo' } })
    ).toBeFalsy();
  });

  it('should not match objects with  missing optional keys', () => {
    expect(isEqual({}, { key: undefined })).toBeFalsy();
    expect(isEqual({ key: undefined }, {})).toBeFalsy();
  });

  it('should match sets', () => {
    expect(isEqual(new Set([1, 2, 3]), new Set([1, 2, 3]))).toBeTruthy();
    expect(isEqual(new Set([1, 2, 3]), new Set([2, 3]))).toBeFalsy();
    expect(isEqual(new Set([1, 2, 3]), new Set([1, 2, 4]))).toBeFalsy();
  });

  it('should match maps', () => {
    expect(isEqual(new Map([[1, 2]]), new Map([[1, 2]]))).toBeTruthy();
    expect(isEqual(new Map([[1, 2]]), new Map([[1, 3]]))).toBeFalsy();
    expect(isEqual(new Map([[1, 2]]), new Map([]))).toBeFalsy();
  });

  it('should match dates', () => {
    expect(isEqual(new Date(1000), new Date(1000))).toBeTruthy();
    expect(isEqual(new Date(1000), new Date(1001))).toBeFalsy();
  });

  it('should match buffers', () => {
    expect(isEqual(Buffer.from('abc'), Buffer.from('abc'))).toBeTruthy();
    expect(isEqual(Buffer.from('abc'), Buffer.from('abd'))).toBeFalsy();
  });
});
