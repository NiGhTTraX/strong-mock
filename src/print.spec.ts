/* eslint-disable class-methods-use-this */
import { describe, it } from 'tdd-buffet/suite/node';
import { ApplyProp } from './expectation/expectation';
import { It } from './expectation/matcher';
import { printCall, printProperty, printReturns } from './print';
import { expectAnsilessContain, expectAnsilessEqual } from '../tests/ansiless';
import { mock } from './mock/mock';

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
    it('should print mock name', () => {
      const mocked = mock({name: 'test'});

      expectAnsilessEqual(printCall('bar', [mocked]), `.bar(mock[test])`);
    });

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
        printCall('bar', [It.isAny(), It.matches(() => true)]),
        `.bar(anything, matches(() => true))`
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
});
