import { willCapture } from './will-capture';

describe('willCapture', () => {
  it('should match anything', () => {
    const matcher = willCapture();

    expect(matcher.matches(23)).toBeTruthy();
    expect(matcher.matches(0)).toBeTruthy();
    expect(matcher.matches(null)).toBeTruthy();
    expect(matcher.matches(undefined)).toBeTruthy();
    expect(matcher.matches('')).toBeTruthy();
  });

  it('should store the incoming argument', () => {
    const matcher = willCapture<number>();

    expect(matcher.value).toBeUndefined();

    expect(matcher.matches(23)).toBeTruthy();

    expect(matcher.value).toEqual(23);
  });

  it('should store the incoming argument per matcher', () => {
    const matcher1 = willCapture<number>();
    const matcher2 = willCapture<number>();

    matcher1.matches(1);
    matcher2.matches(2);

    expect(matcher1.value).toEqual(1);
    expect(matcher2.value).toEqual(2);
  });

  it('should pretty print', () => {
    expect(willCapture().toJSON()).toEqual('Matcher(captures)');
    expect(willCapture('custom').toJSON()).toEqual('custom');
  });

  it('should print diff', () => {
    expect(willCapture().getDiff('foo')).toEqual({
      actual: 'foo',
      expected: 'foo',
    });

    expect(willCapture('captor').getDiff('foo')).toEqual({
      actual: 'foo',
      expected: 'foo',
    });
  });
});
