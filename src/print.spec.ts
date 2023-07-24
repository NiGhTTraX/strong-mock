/* eslint-disable class-methods-use-this */
import { expectAnsilessContain, expectAnsilessEqual } from '../tests/ansiless';
import {
  printDiffForAllExpectations,
  printExpectationDiff,
} from './errors/unexpected-call';
import { ApplyProp } from './expectation/expectation';
import { StrongExpectation } from './expectation/strong-expectation';
import { matches } from './matchers/matcher';

import { printCall, printProperty, printReturns } from './print';

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
      expectAnsilessEqual(printCall('bar', [1, 2, 3]), `.bar(1, 2, 3)`);
    });

    it('should print function call', () => {
      expectAnsilessEqual(printCall(ApplyProp, [1, 2, 3]), `(1, 2, 3)`);
    });

    it('should print symbol call', () => {
      expectAnsilessEqual(
        printCall(Symbol('bar'), [1, 2, 3]),
        `[Symbol(bar)](1, 2, 3)`
      );
    });

    it('should deep print args', () => {
      expectAnsilessEqual(
        printCall('bar', [1, 2, { foo: 'bar' }]),
        `.bar(1, 2, {"foo": "bar"})`
      );
    });

    it('should print arg matchers', () => {
      expectAnsilessEqual(
        printCall('bar', [matches(() => true, { toJSON: () => 'matcher' })]),
        `.bar(matcher)`
      );
    });

    it('should print undefined args', () => {
      expectAnsilessEqual(printCall('bar', [undefined]), `.bar(undefined)`);
    });
  });

  describe('printReturn', () => {
    it('should print invocation count', () => {
      expectAnsilessContain(
        printReturns({ value: 23 }, 1, 3),
        `.between(1, 3)`
      );
    });

    it('should print return value', () => {
      expectAnsilessContain(
        printReturns({ value: 23 }, 1, 1),
        `.thenReturn(23)`
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
          1
        ),
        `.thenThrow([Error: foobar])`
      );
    });

    it('should print promise', () => {
      expectAnsilessContain(
        printReturns({ value: 23, isPromise: true }, 1, 1),
        `.thenResolve(23)`
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
          1
        ),
        `.thenReject([Error: foobar])`
      );
    });
  });

  describe('printExpectationDiff', () => {
    it('should print the diff when we have single expectation', () => {
      const matcher = matches(() => false, {
        getDiff: (actual) => ({ actual, expected: 'foo' }),
      });

      const expectation = new StrongExpectation(':irrelevant:', [matcher], {
        value: ':irrelevant:',
      });

      const args = ['bar'];

      expectAnsilessEqual(
        printExpectationDiff(expectation, args),
        `-   "foo",
+   "bar"`
      );
    });
    it('should print the diff for an expectation with no received args', () => {
      const matcher = matches(() => false, {
        getDiff: (actual) => ({ actual, expected: 'foo' }),
      });

      const expectation = new StrongExpectation(':irrelevant:', [matcher], {
        value: ':irrelevant:',
      });

      expectAnsilessEqual(
        printExpectationDiff(expectation, []),
        `-   "foo",
+   undefined`
      );
    });

    it('should not print the diff for an expectation with no expected args', () => {
      const expectation = new StrongExpectation(':irrelevant:', [], {
        value: ':irrelevant:',
      });

      expectAnsilessEqual(printExpectationDiff(expectation, [1, 2]), '');
    });
  });

  describe('printDiffForAllExpectations', () => {
    it('should print the diff when we have multiple expectations', () => {
      const matcher = matches(() => false, {
        getDiff: (actual) => ({ actual, expected: 'foo' }),
        toJSON: () => 'matcher',
      });

      const expectation = new StrongExpectation('prop', [matcher], {
        value: 'return',
      });

      const args = ['bar'];

      expectAnsilessEqual(
        printDiffForAllExpectations([expectation, expectation], args),
        `when(() => mock.prop(matcher)).thenReturn("return").between(1, 1)
- Expected
+ Received

-   "foo",
+   "bar"

when(() => mock.prop(matcher)).thenReturn("return").between(1, 1)
- Expected
+ Received

-   "foo",
+   "bar"`
      );
    });
  });
});
