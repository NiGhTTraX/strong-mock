import { describe, expect, it } from 'vitest';
import { NotAMock } from '../errors/api.js';
import { when } from '../index.js';
import { getMockState } from '../mock/map.js';
import { mock } from '../mock/mock.js';
import { reset } from './reset.js';

describe('reset', () => {
  it('should clear the expectation repo', () => {
    const fn = mock<() => void>();

    when(() => fn()).thenReturn(undefined);
    reset(fn);

    expect(getMockState(fn).repository.getUnmet()).toHaveLength(0);
  });

  it('should throw if called on a non mock', () => {
    expect(() => reset('bla')).toThrow(NotAMock);
  });
});
