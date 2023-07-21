import { isNumber } from './is-number';

describe('isNumber', () => {
  it('should match 0', () => {
    expect(isNumber().matches(0)).toBeTruthy();
  });

  it('should match positive integers', () => {
    expect(isNumber().matches(23)).toBeTruthy();
  });

  it('should match negative integers', () => {
    expect(isNumber().matches(-23)).toBeTruthy();
  });

  it('should match positive floats', () => {
    expect(isNumber().matches(10.5)).toBeTruthy();
  });

  it('should match negative floats', () => {
    expect(isNumber().matches(-10.5)).toBeTruthy();
  });

  it('should math positive scientific notation', () => {
    expect(isNumber().matches(10e2)).toBeTruthy();
  });

  it('should math negative scientific notation', () => {
    expect(isNumber().matches(-10e2)).toBeTruthy();
  });

  it('should not match strings', () => {
    expect(isNumber().matches('foo')).toBeFalsy();
  });

  it('should not match strings numbers', () => {
    expect(isNumber().matches('10')).toBeFalsy();
  });

  it('should not match strings containing numbers', () => {
    expect(isNumber().matches('10foo')).toBeFalsy();
  });

  it('should not match NaN', () => {
    expect(isNumber().matches(NaN)).toBeFalsy();
  });

  it('should pretty print', () => {
    expect(isNumber().toJSON()).toEqual('number');
  });

  it('should return diff', () => {
    expect(isNumber().getDiff('NaN')).toEqual({
      expected: 'number',
      actual: '"NaN" (string)',
    });

    expect(isNumber().getDiff({ foo: 'bar' })).toEqual({
      expected: 'number',
      actual: '{"foo": "bar"} (object)',
    });
  });
});
