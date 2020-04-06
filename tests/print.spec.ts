/* eslint-disable class-methods-use-this */
import { describe, it } from 'tdd-buffet/suite/node';
import { ApplyProp } from '../src/expectation';
import { It } from '../src/matcher';
import { printCall, printProperty, printReturns } from '../src/print';
import { expectAnsilessEqual } from './ansiless';

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
        printCall('bar', [It.isAny(), It.matches(() => true)]),
        `.bar(anything, matches(() => true))`
      );
    });

    it('should print undefined args', () => {
      expectAnsilessEqual(printCall('bar', [undefined]), `.bar(undefined)`);
    });
  });

  describe('printReturn', () => {
    it('should print return value and invocation count', () => {
      expectAnsilessEqual(
        printReturns(23, 1, 1),
        `.thenReturn(23).between(1, 1)`
      );
    });

    it('should print error and invocation count', () => {
      expectAnsilessEqual(
        printReturns(new Error('foobar'), 1, 1),
        `.thenThrow("foobar").between(1, 1)`
      );
    });
  });
});
