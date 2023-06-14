import { It } from './it';

describe('isAny', () => {
  it('should match null', () => {
    expect(It.isAny().matches(null)).toBeTruthy();
  });

  it('should match undefined', () => {
    expect(It.isAny().matches(undefined)).toBeTruthy();
  });

  it('should match strings', () => {
    expect(It.isAny().matches('foobar')).toBeTruthy();
  });

  it('should match numbers', () => {
    expect(It.isAny().matches(23)).toBeTruthy();
  });

  it('should match booleans', () => {
    expect(It.isAny().matches(true)).toBeTruthy();
  });

  it('should match objects', () => {
    expect(It.isAny().matches({ foo: 'bar' })).toBeTruthy();
  });

  it('should match arrays', () => {
    expect(It.isAny().matches([1, 2, 3])).toBeTruthy();
  });

  it('should pretty print', () => {
    expect(It.isAny().toJSON()).toEqual('anything');
  });
});
