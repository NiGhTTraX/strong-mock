import {
  expectAnsilessContain,
  expectAnsilessEqual,
} from '../../tests/ansiless';
import { StrongExpectation } from '../expectation/strong-expectation';
import { matches } from '../matchers/matcher';

import { printArgsDiff, UnexpectedCall } from './unexpected-call';

describe('UnexpectedCall', () => {
  describe('error', () => {
    it('should print the call', () => {
      const error = new UnexpectedCall('bar', [1, 2, 3], []);

      expectAnsilessContain(
        error.message,
        `Didn't expect mock.bar(1, 2, 3) to be called.`
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
        [expectation]
      );

      expect(error.matcherResult).toEqual({
        actual: ['actual', 'actual'],
        expected: ['expected', 'expected'],
      });
    });

    it('should not contain actual and expected values when the expectation has no expected args', () => {
      const expectation = new StrongExpectation('foo', [], {
        value: ':irrelevant:',
      });

      const error = new UnexpectedCall(
        'foo',
        ['any arg', 'any arg'],
        [expectation]
      );

      expect(error.matcherResult).toBeUndefined();
    });
  });

  describe('printArgsDiff', () => {
    it('should print diff for mismatching primitive pair', () => {
      expectAnsilessEqual(
        printArgsDiff(['foo'], ['bar']),
        `-   "foo",
+   "bar"`
      );
    });

    it('should print diff for mismatching primitive pair at the end', () => {
      expectAnsilessEqual(
        printArgsDiff(['foo', 'bar'], ['foo', 'baz']),
        `    "foo",
-   "bar",
+   "baz"`
      );
    });

    it('should print diff for mismatching primitive pair at the beginning', () => {
      expectAnsilessEqual(
        printArgsDiff(['foo', 'bar'], ['bar', 'bar']),
        `-   "foo",
+   "bar",
    "bar"`
      );
    });

    it('should print diff for mismatching consecutive primitive pairs', () => {
      expectAnsilessEqual(
        printArgsDiff(['one', 'two'], ['three', 'four']),
        `-   "one",
-   "two",
+   "three",
+   "four"`
      );
    });

    it('should print diff for mismatching object pair', () => {
      expectAnsilessEqual(
        printArgsDiff([{ foo: 'bar' }], [{ foo: 'baz' }]),
        `    Object {
-     "foo": "bar",
+     "foo": "baz",
    }`
      );
    });

    it('should print diff for mismatching array pair', () => {
      expectAnsilessEqual(
        printArgsDiff([['foo']], [['bar']]),
        `    Array [
-     "foo",
+     "bar",
    ]`
      );
    });

    it('should print diff for missing args', () => {
      expectAnsilessEqual(printArgsDiff(['foo'], []), `-   "foo"`);
      expectAnsilessEqual(printArgsDiff([], ['foo']), `+   "foo"`);
    });

    it('should print diff for undefined args', () => {
      expectAnsilessEqual(
        printArgsDiff(['foo'], [undefined]),
        `-   "foo",
+   undefined`
      );
    });

    it('should print diff for mismatching types', () => {
      expectAnsilessEqual(
        printArgsDiff(['foo'], [{ foo: 'bar' }]),
        `-   "foo",
+   Object {
+     "foo": "bar",
+   }`
      );
    });
  });
});
