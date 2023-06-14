import { It } from './it';

describe('isNumber', () => {
  it('should match 0', () => {
    expect(It.isNumber().matches(0)).toBeTruthy();
  });

  it('should match positive integers', () => {
    expect(It.isNumber().matches(23)).toBeTruthy();
  });

  it('should match negative integers', () => {
    expect(It.isNumber().matches(-23)).toBeTruthy();
  });

  it('should match positive floats', () => {
    expect(It.isNumber().matches(10.5)).toBeTruthy();
  });

  it('should match negative floats', () => {
    expect(It.isNumber().matches(-10.5)).toBeTruthy();
  });

  it('should math positive scientific notation', () => {
    expect(It.isNumber().matches(10e2)).toBeTruthy();
  });

  it('should math negative scientific notation', () => {
    expect(It.isNumber().matches(-10e2)).toBeTruthy();
  });

  it('should not match strings', () => {
    expect(It.isNumber().matches('foo')).toBeFalsy();
  });

  it('should not match strings numbers', () => {
    expect(It.isNumber().matches('10')).toBeFalsy();
  });

  it('should not match strings containing numbers', () => {
    expect(It.isNumber().matches('10foo')).toBeFalsy();
  });

  it('should not match NaN', () => {
    expect(It.isNumber().matches(NaN)).toBeFalsy();
  });

  it('should pretty print', () => {
    expect(It.isNumber().toJSON()).toEqual('number');
  });
});
