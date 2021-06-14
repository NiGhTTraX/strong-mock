import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { Matcher } from '../src/expectation/matcher';
import { StrongExpectation } from '../src/expectation/strong-expectation';
import { expectAnsilessEqual } from './ansiless';

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

  it('should match primitives', () => {
    const expectation = new StrongExpectation('bar', [1, '2', true], {
      value: undefined,
    });

    expect(expectation.matches([1, '2', true])).toBeTruthy();
    expect(expectation.matches([2, '2', true])).toBeFalsy();
    expect(expectation.matches([1, '3', true])).toBeFalsy();
    expect(expectation.matches([1, '2', false])).toBeFalsy();
  });

  it('should match objects', () => {
    const expectation = new StrongExpectation(
      'bar',
      [
        {
          bar: { baz: 42 },
        },
      ],
      { value: undefined }
    );

    expect(
      expectation.matches([
        {
          bar: { baz: 42 },
        },
      ])
    ).toBeTruthy();
  });

  it('should match arrays', () => {
    const expectation = new StrongExpectation('bar', [[1, 2, 3]], {
      value: 23,
    });

    expect(expectation.matches([[1, 2, 3]])).toBeTruthy();
  });

  it('should match deep arrays', () => {
    const expectation = new StrongExpectation('bar', [[1, 2, [3, 4]]], {
      value: 23,
    });

    expect(expectation.matches([[1, 2, [3, 4]]])).toBeTruthy();
  });

  it('should match sets', () => {
    const expectation = new StrongExpectation('bar', [new Set([1, 2, 3])], {
      value: 23,
    });

    expect(expectation.matches([new Set([1, 2, 3])])).toBeTruthy();
  });

  it('should match maps', () => {
    const expectation = new StrongExpectation(
      'bar',
      [
        new Map([
          [1, true],
          [2, false],
        ]),
      ],
      { value: 23 }
    );

    expect(
      expectation.matches([
        new Map([
          [1, true],
          [2, false],
        ]),
      ])
    ).toBeTruthy();
  });

  it('should match optional args against undefined', () => {
    const expectation = new StrongExpectation('bar', [undefined], {
      value: 23,
    });

    expect(expectation.matches([])).toBeTruthy();
  });

  it('should match passed in optional args', () => {
    const expectation = new StrongExpectation('bar', [], { value: 23 });

    expect(expectation.matches([42])).toBeTruthy();
  });

  it('should not match missing expected optional arg', () => {
    const expectation = new StrongExpectation('bar', [23], { value: 23 });

    expect(expectation.matches([])).toBeFalsy();
  });

  it('should not match defined expected undefined optional arg', () => {
    const expectation = new StrongExpectation('bar', [undefined], {
      value: 23,
    });

    expect(expectation.matches([42])).toBeFalsy();
  });

  it('should call matchers', () => {
    let matchesCalledWith;

    const spyMatcher: Matcher<any> = {
      __isMatcher: true,
      matches: (arg: any) => {
        matchesCalledWith = arg;
        return true;
      },
    };

    const expectation = new StrongExpectation('bar', [spyMatcher], {
      value: 23,
    });

    expect(expectation.matches([23])).toBeTruthy();
    expect(matchesCalledWith).toEqual(23);
  });

  it('should print when, returns and invocation count', () => {
    const expectation = new StrongExpectation('baz', [4, 5, 6], { value: 42 });
    expectation.setInvocationCount(2, 3);

    expectAnsilessEqual(
      expectation.toJSON(),
      `when(mock.baz(4, 5, 6)).thenReturn(42).between(2, 3)`
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
