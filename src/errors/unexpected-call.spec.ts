import { expectAnsilessContain } from '../../tests/ansiless';
import { StrongExpectation } from '../expectation/strong-expectation';
import { matches } from '../matchers/matcher';

import { UnexpectedCall } from './unexpected-call';

describe('UnexpectedCall', () => {
  it('should print the call', () => {
    const error = new UnexpectedCall('bar', [1, 2, 3], []);

    expectAnsilessContain(
      error.message,
      `Didn't expect mock.bar(1, 2, 3) to be called.`,
    );
  });

  it('should print the diff', () => {
    const matcher = matches(() => false, {
      getDiff: (actual) => ({ actual, expected: 'foo' }),
    });

    const expectation = new StrongExpectation('bar', [matcher], {
      value: ':irrelevant:',
    });

    const error = new UnexpectedCall('bar', [1, 2, 3], [expectation]);

    expectAnsilessContain(error.message, `Expected`);
  });

  it('should print the diff only for expectations for the same property', () => {
    const matcher = matches(() => false, {
      getDiff: (actual) => ({ actual, expected: 'foo' }),
    });

    const e1 = new StrongExpectation('foo', [matcher], {
      value: ':irrelevant:',
    });
    const e2 = new StrongExpectation('bar', [matcher], {
      value: ':irrelevant:',
    });

    const error = new UnexpectedCall('foo', [1, 2, 3], [e1, e2]);

    // Yeah, funky way to do a negated ansiless contains.
    expect(() => expectAnsilessContain(error.message, `bar`)).toThrow();
  });

  it("should contain actual and expected values when there's a single expectation remaining", () => {
    const matcher = matches(() => false, {
      getDiff: () => ({ actual: 'actual', expected: 'expected' }),
    });

    const expectation = new StrongExpectation('foo', [matcher, matcher], {
      value: ':irrelevant:',
    });

    const error = new UnexpectedCall(
      'foo',
      ['any arg', 'any arg'],
      [expectation],
    );

    expect(error.matcherResult).toEqual({
      actual: ['actual', 'actual'],
      expected: ['expected', 'expected'],
    });
  });

  it('should not contain actual and expected values when the expectation has 0 args', () => {
    const expectation = new StrongExpectation('foo', [], {
      value: ':irrelevant:',
    });

    const error = new UnexpectedCall('foo', [], [expectation]);

    expect(error.matcherResult).toBeUndefined();
  });

  it('should not contain actual and expected values when the expectation is on a property', () => {
    const expectation = new StrongExpectation('foo', undefined, {
      value: ':irrelevant:',
    });

    const error = new UnexpectedCall('foo', [], [expectation]);

    expect(error.matcherResult).toBeUndefined();
  });
});
