import { matches } from './matcher';

describe('matches', () => {
  it('should support custom predicates', () => {
    expect(matches(() => true).matches(':irrelevant:')).toBeTruthy();
    expect(matches(() => false).matches(':irrelevant:')).toBeFalsy();
    expect(matches((arg) => !!arg).matches(true)).toBeTruthy();
    expect(matches((arg) => !!arg).matches(false)).toBeFalsy();
  });

  it('should pretty print', () => {
    expect(matches(() => true).toJSON()).toEqual('matches(() => true)');
  });

  it('should pretty print with custom message', () => {
    expect(matches(() => true, { toJSON: () => 'foobar' }).toJSON()).toEqual(
      'foobar'
    );
  });

  it('should call getDiff if the matcher fails', () => {
    const matcher = matches(() => false, {
      getDiff: () => ({ actual: 'a', expected: 'e' }),
    });

    expect(matcher.getDiff(42)).toEqual({ actual: 'a', expected: 'e' });
  });

  it('should not call getDiff if the matcher succeeds', () => {
    const matcher = matches(() => true, {
      getDiff: () => ({ actual: 'a', expected: 'e' }),
    });

    expect(matcher.getDiff(42)).toEqual({ actual: 42, expected: 42 });
  });

  it('should use toJSON as the default getDiff', () => {
    const matcher = matches(() => false, { toJSON: () => 'foobar' });

    expect(matcher.getDiff(42)).toEqual({ actual: 42, expected: 'foobar' });
  });
});
