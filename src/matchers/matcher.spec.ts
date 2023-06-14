import { It } from './it';

describe('matches', () => {
  it('should support custom predicates', () => {
    expect(It.matches(() => true).matches(':irrelevant:')).toBeTruthy();
    expect(It.matches(() => false).matches(':irrelevant:')).toBeFalsy();
    expect(It.matches((arg) => !!arg).matches(true)).toBeTruthy();
    expect(It.matches((arg) => !!arg).matches(false)).toBeFalsy();
  });

  it('should pretty print', () => {
    expect(It.matches(() => true).toJSON()).toEqual('matches(() => true)');
  });

  it('should pretty print with custom message', () => {
    expect(It.matches(() => true, { toJSON: () => 'foobar' }).toJSON()).toEqual(
      'foobar'
    );
  });

  it('should call getDiff if the matcher fails', () => {
    const matcher = It.matches(() => false, {
      getDiff: () => ({ actual: 'a', expected: 'e' }),
    });

    expect(matcher.getDiff(42)).toEqual({ actual: 'a', expected: 'e' });
  });

  it('should call getDiff if the matcher succeeds', () => {
    const matcher = It.matches(() => true, {
      getDiff: () => ({ actual: 'a', expected: 'e' }),
    });

    expect(matcher.getDiff(42)).toEqual({ actual: 'a', expected: 'e' });
  });

  it('should use toJSON as the default getDiff', () => {
    const matcher = It.matches(() => false, { toJSON: () => 'foobar' });

    expect(matcher.getDiff(42)).toEqual({ actual: 42, expected: 'foobar' });
  });
});
