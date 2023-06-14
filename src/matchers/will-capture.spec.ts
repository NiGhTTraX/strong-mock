import { It } from './it';

describe('willCapture', () => {
  it('should match anything', () => {
    const matcher = It.willCapture();

    expect(matcher.matches(23)).toBeTruthy();
    expect(matcher.matches(0)).toBeTruthy();
    expect(matcher.matches(null)).toBeTruthy();
    expect(matcher.matches(undefined)).toBeTruthy();
    expect(matcher.matches('')).toBeTruthy();
  });

  it('should store the incoming argument', () => {
    const matcher = It.willCapture<number>();

    expect(matcher.value).toBeUndefined();

    expect(matcher.matches(23)).toBeTruthy();

    expect(matcher.value).toEqual(23);
  });

  it('should store the incoming argument per matcher', () => {
    const matcher1 = It.willCapture<number>();
    const matcher2 = It.willCapture<number>();

    matcher1.matches(1);
    matcher2.matches(2);

    expect(matcher1.value).toEqual(1);
    expect(matcher2.value).toEqual(2);
  });

  it('should pretty print', () => {
    expect(It.willCapture().toJSON()).toEqual('captures');
    expect(It.willCapture('custom').toJSON()).toEqual('custom');
  });

  it('should print diff', () => {
    expect(It.willCapture().getDiff('foo')).toEqual({
      actual: 'foo',
      expected: 'foo',
    });

    expect(It.willCapture('captor').getDiff('foo')).toEqual({
      actual: 'foo',
      expected: 'foo',
    });
  });
});
