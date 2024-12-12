import { isPlainObject } from './is-plain-object';

describe('isPlainObject', () => {
  it('should match plain objects', () => {
    expect(isPlainObject().matches({})).toBeTruthy();
    expect(isPlainObject().matches({ foo: 'bar' })).toBeTruthy();
    expect(isPlainObject().matches({ 0: 1 })).toBeTruthy();
    expect(isPlainObject().matches({ [Symbol('')]: '42' })).toBeTruthy();
    expect(isPlainObject().matches(Object.create(null))).toBeTruthy();
  });

  it('should not match non plain objects', () => {
    expect(isPlainObject().matches(new (class {})())).toBeFalsy();
    expect(isPlainObject().matches([])).toBeFalsy();
    expect(isPlainObject().matches(new Map([]))).toBeFalsy();
    expect(isPlainObject().matches(new Set())).toBeFalsy();
  });

  it('should pretty print', () => {
    expect(isPlainObject().toString()).toEqual('Matcher<object>');
  });

  it('should return diff for non objects', () => {
    expect(isPlainObject().getDiff('not object')).toEqual({
      expected: 'Matcher<object>',
      actual: '"not object" (string)',
    });
  });

  it('should return diff for object like values', () => {
    expect(
      isPlainObject().getDiff(
        new (class {
          foo = 'bar';
        })(),
      ),
    ).toEqual({
      expected: 'Matcher<object>',
      actual: '{"foo": "bar"} (object-like)',
    });

    expect(isPlainObject().getDiff([])).toEqual({
      expected: 'Matcher<object>',
      actual: '[] (object-like)',
    });
  });
});
