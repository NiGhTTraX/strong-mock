import { describe, expect, it } from 'vitest';
import { unboxReturnValue } from './return-value.js';

describe('unboxReturnValue', () => {
  it('should return a value', () => {
    expect(unboxReturnValue({ value: 23 })).toEqual(23);
  });

  it('should return a promise', async () => {
    expect(await unboxReturnValue({ value: 23, isPromise: true })).toEqual(23);
  });

  it('should return a value', async () => {
    expect(await unboxReturnValue({ value: Promise.resolve(23) })).toEqual(23);
  });

  it('should throw an error', () => {
    expect(() =>
      unboxReturnValue({ value: new Error('foo'), isError: true }),
    ).toThrow('foo');
  });

  it('should throw an error message', () => {
    expect(() => unboxReturnValue({ value: 'foo', isError: true })).toThrow(
      'foo',
    );
  });

  it('should reject an error', async () => {
    await expect(() =>
      unboxReturnValue({
        value: new Error('foo'),
        isError: true,
        isPromise: true,
      }),
    ).rejects.toThrow('foo');
  });

  it('should reject an error message', async () => {
    await expect(() =>
      unboxReturnValue({ value: 'foo', isError: true, isPromise: true }),
    ).rejects.toThrow('foo');
  });
});
