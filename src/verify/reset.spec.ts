/* eslint-disable class-methods-use-this */
import { NotAMock } from '../errors';
import { when } from '../index';
import { getMockState } from '../mock/map';
import { mock } from '../mock/mock';
import { reset } from './reset';

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
