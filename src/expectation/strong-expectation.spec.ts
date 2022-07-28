import { expectAnsilessEqual } from '../../tests/ansiless';
import { It } from './it';
import { StrongExpectation } from './strong-expectation';

describe('StrongExpectation', () => {
  it('should match empty args', () => {
    const expectation = new StrongExpectation('bar', [], { value: undefined });

    expect(expectation.matches([])).toBeTruthy();
  });

  it('should match no args', () => {
    const expectation = new StrongExpectation('bar', undefined, {
      value: undefined,
    });

    expect(expectation.matches(undefined)).toBeTruthy();
    expect(expectation.matches([1])).toBeFalsy();
  });

  it('should match optional args against undefined', () => {
    const expectation = new StrongExpectation(
      'bar',
      [It.deepEquals(undefined)],
      {
        value: 23,
      }
    );

    expect(expectation.matches([])).toBeTruthy();
  });

  it('should match passed in optional args', () => {
    const expectation = new StrongExpectation('bar', [], { value: 23 });

    expect(expectation.matches([42])).toBeTruthy();
  });

  it('should not match missing expected optional arg', () => {
    const expectation = new StrongExpectation('bar', [It.deepEquals(23)], {
      value: 23,
    });

    expect(expectation.matches([])).toBeFalsy();
  });

  it('should not match defined expected undefined optional arg', () => {
    const expectation = new StrongExpectation(
      'bar',
      [It.deepEquals(undefined)],
      {
        value: 23,
      }
    );

    expect(expectation.matches([42])).toBeFalsy();
  });

  it('should print when, returns and invocation count', () => {
    const expectation = new StrongExpectation(
      'baz',
      [It.deepEquals(4), It.deepEquals(5), It.deepEquals(6)],
      {
        value: 42,
      }
    );
    expectation.setInvocationCount(2, 3);

    expectAnsilessEqual(
      expectation.toJSON(),
      `when(() => mock.baz(4, 5, 6)).thenReturn(42).between(2, 3)`
    );
  });

  it('should by default match only once', () => {
    const expectation = new StrongExpectation('bar', [], { value: undefined });

    expect(expectation.matches([])).toBeTruthy();
    expect(expectation.matches([])).toBeFalsy();
  });

  it('should match at most max times', () => {
    const expectation = new StrongExpectation('bar', [], { value: undefined });
    expectation.setInvocationCount(1, 2);

    expect(expectation.matches([])).toBeTruthy();
    expect(expectation.matches([])).toBeTruthy();
    expect(expectation.matches([])).toBeFalsy();
  });

  it('should match forever', () => {
    const expectation = new StrongExpectation('bar', [], { value: undefined });
    expectation.setInvocationCount(0, 0);

    expect(expectation.matches([])).toBeTruthy();
    expect(expectation.matches([])).toBeTruthy();
  });

  it('should by default be unmet', () => {
    const expectation = new StrongExpectation('bar', [], { value: undefined });

    expect(expectation.isUnmet()).toBeTruthy();
  });

  it('should by met if min is 0', () => {
    const expectation = new StrongExpectation('bar', [], { value: undefined });
    expectation.setInvocationCount(0);

    expect(expectation.isUnmet()).toBeFalsy();
  });

  it('should become met if min is satisfied', () => {
    const expectation = new StrongExpectation('bar', [], { value: undefined });
    expectation.setInvocationCount(1);

    expectation.matches([]);
    expect(expectation.isUnmet()).toBeFalsy();
  });

  it('should remain unmet until min is satisfied', () => {
    const expectation = new StrongExpectation('bar', [], { value: undefined });
    expectation.setInvocationCount(2);

    expectation.matches([]);
    expect(expectation.isUnmet()).toBeTruthy();
  });
});
