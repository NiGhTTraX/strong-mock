import { describe, it } from 'vitest';
import {
  expectAnsilessContain,
  expectAnsilessEqual,
} from '../tests/ansiless.js';
import {
  printDiffForAllExpectations,
  printExpectationDiff,
} from './errors/diff.js';
import { ApplyProp } from './expectation/expectation.js';
import { StrongExpectation } from './expectation/strong-expectation.js';
import { matches } from './matchers/matcher.js';
import { printCall, printProperty, printReturns } from './print.js';

describe('print', () => {
  describe('printProperty', () => {
    it('should print function call', () => {
      expectAnsilessEqual(printProperty(ApplyProp), '');
    });

    it('should print property access', () => {
      expectAnsilessEqual(printProperty('bar'), `.bar`);
    });

    it('should print symbol access', () => {
      expectAnsilessEqual(printProperty(Symbol('bar')), `[Symbol(bar)]`);
    });
  });

  describe('printCall', () => {
    it('should print method call', () => {
      expectAnsilessEqual(
        printCall('mockName', 'bar', [1, 2, 3]),
        `mockName.bar(1, 2, 3)`,
      );
    });

    it('should print function call', () => {
      expectAnsilessEqual(
        printCall('mockName', ApplyProp, [1, 2, 3]),
        `mockName(1, 2, 3)`,
      );
    });

    it('should print symbol call', () => {
      expectAnsilessEqual(
        printCall('mockName', Symbol('bar'), [1, 2, 3]),
        `mockName[Symbol(bar)](1, 2, 3)`,
      );
    });

    it('should deep print args', () => {
      expectAnsilessEqual(
        printCall('mockName', 'bar', [1, 2, { foo: 'bar' }]),
        `mockName.bar(1, 2, {"foo": "bar"})`,
      );
    });

    it('should print arg matchers', () => {
      expectAnsilessEqual(
        printCall('mockName', 'bar', [
          matches(() => true, { toString: () => 'matcher' }),
        ]),
        `mockName.bar(matcher)`,
      );
    });

    it('should print undefined args', () => {
      expectAnsilessEqual(
        printCall('mockName', 'bar', [undefined]),
        `mockName.bar(undefined)`,
      );
    });
  });

  describe('printReturn', () => {
    it('should print invocation count', () => {
      expectAnsilessContain(
        printReturns({ value: 23 }, 1, 3),
        `.between(1, 3)`,
      );
    });

    it('should print return value', () => {
      expectAnsilessContain(
        printReturns({ value: 23 }, 1, 1),
        `.thenReturn(23)`,
      );
    });

    it('should print error', () => {
      expectAnsilessContain(
        printReturns(
          {
            value: new Error('foobar'),
            isError: true,
          },
          1,
          1,
        ),
        `.thenThrow([Error: foobar])`,
      );
    });

    it('should print promise', () => {
      expectAnsilessContain(
        printReturns({ value: 23, isPromise: true }, 1, 1),
        `.thenResolve(23)`,
      );
    });

    it('should print promise rejection', () => {
      expectAnsilessContain(
        printReturns(
          {
            value: new Error('foobar'),
            isPromise: true,
            isError: true,
          },
          1,
          1,
        ),
        `.thenReject([Error: foobar])`,
      );
    });
  });

  describe('printExpectationDiff', () => {
    it('should print the diff when we have a single expectation', () => {
      const matcher = matches(() => false, {
        getDiff: (actual) => ({ actual, expected: 'foo' }),
      });

      const expectation = new StrongExpectation(
        'mockName',
        ':irrelevant:',
        [matcher],
        {
          value: ':irrelevant:',
        },
      );

      const args = ['bar'];

      expectAnsilessEqual(
        printExpectationDiff(expectation, args),
        `-   "foo",
+   "bar"`,
      );
    });

    it('should print the diff for an expectation with no received args', () => {
      const matcher = matches(() => false, {
        getDiff: (actual) => ({ actual, expected: 'foo' }),
      });

      const expectation = new StrongExpectation(
        'mockName',
        ':irrelevant:',
        [matcher],
        {
          value: ':irrelevant:',
        },
      );

      expectAnsilessEqual(
        printExpectationDiff(expectation, []),
        `-   "foo",
+   undefined`,
      );
    });

    it('should not print the diff for an expectation with no expected args', () => {
      const expectation = new StrongExpectation(
        'mockName',
        ':irrelevant:',
        [],
        {
          value: ':irrelevant:',
        },
      );

      expectAnsilessEqual(printExpectationDiff(expectation, [1, 2]), '');
    });

    it('should not print the diff for an expectation on a property', () => {
      const expectation = new StrongExpectation(
        'mockName',
        ':irrelevant:',
        undefined,
        {
          value: ':irrelevant:',
        },
      );

      expectAnsilessEqual(printExpectationDiff(expectation, [1, 2]), '');
    });
  });

  describe('printDiffForAllExpectations', () => {
    it('should print the diff when we have multiple expectations', () => {
      const matcher = matches(() => false, {
        getDiff: (actual) => ({ actual, expected: 'foo' }),
        toString: () => 'matcher',
      });

      const expectation = new StrongExpectation('mockName', 'prop', [matcher], {
        value: 'return',
      });

      const args = ['bar'];

      expectAnsilessEqual(
        printDiffForAllExpectations([expectation, expectation], args),
        `when(() => mockName.prop(matcher)).thenReturn("return").between(1, 1)
- Expected
+ Received

-   "foo",
+   "bar"

when(() => mockName.prop(matcher)).thenReturn("return").between(1, 1)
- Expected
+ Received

-   "foo",
+   "bar"`,
      );
    });
  });
});
