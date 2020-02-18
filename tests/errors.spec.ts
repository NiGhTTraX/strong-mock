import stripAnsi from 'strip-ansi';
import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { It } from '../src';
import {
  UnexpectedAccessError,
  UnmetApplyExpectationError,
  UnmetMethodExpectationError,
  UnmetPropertyExpectationError,
  WrongApplyArgsError,
  WrongMethodArgsError
} from '../src/errors';
import { MethodExpectation } from '../src/method-expectation';
import { PropertyExpectation } from '../src/property-expectation';

describe('Mock', () => {
  describe('errors', () => {
    function expectEqualAnsiless(actual: string, expected: string) {
      expect(stripAnsi(actual)).toEqual(expected);
    }

    function expectContainAnsiless(actual: string, expected: string) {
      expect(stripAnsi(actual)).toContain(expected);
    }

    describe('WrongMethodArgsError', () => {
      it('e2e', () => {
        const error = new WrongMethodArgsError(
          'foobar',
          [1, 2, 3],
          [new MethodExpectation([1], 2), new MethodExpectation([3], 4)]
        );

        expectEqualAnsiless(
          error.message,
          `"foobar" not expected to have been called with 1, 2, 3

Existing expectations:
 - 1 returns 2 exactly 1 time(s)
 - 3 returns 4 exactly 1 time(s)`
        );
      });

      it('should contain the name of the method', () => {
        const error = new WrongMethodArgsError('method', [], []);

        expectContainAnsiless(error.message, 'method');
      });

      it('should contain all the expectations', () => {
        const error = new WrongMethodArgsError(
          ':irrelevant:',
          [],
          [new MethodExpectation([1], 2), new MethodExpectation([3], 4)]
        );

        expectContainAnsiless(error.message, '1 returns 2');
        expectContainAnsiless(error.message, '3 returns 4');
      });
    });

    describe('WrongApplyError', () => {
      it('e2e', () => {
        const error = new WrongApplyArgsError(
          [1, 2, 3],
          [new MethodExpectation([1], 2), new MethodExpectation([3], 4)]
        );

        expectEqualAnsiless(
          error.message,
          `Function not expected to have been called with 1, 2, 3

Existing expectations:
 - 1 returns 2 exactly 1 time(s)
 - 3 returns 4 exactly 1 time(s)`
        );
      });

      it('should contain all the expectations', () => {
        const error = new WrongApplyArgsError(
          [],
          [new MethodExpectation([1], 2), new MethodExpectation([3], 4)]
        );

        expectContainAnsiless(error.message, '1 returns 2');
        expectContainAnsiless(error.message, '3 returns 4');
      });
    });

    describe('UnexpectedAccessError', () => {
      it('should contain the name of the property', () => {
        const error = new UnexpectedAccessError('property');

        expectContainAnsiless(error.message, 'property');
      });
    });

    describe('UnmetMethodExpectationError', () => {
      it('e2e', () => {
        const error = new UnmetMethodExpectationError(
          'foobar',
          new MethodExpectation([1, 2, 3], 1),
          [
            new MethodExpectation([1, 2, 3], 1),
            new MethodExpectation([4, 5, 6], 2)
          ]
        );

        expectEqualAnsiless(
          error.message,
          `Expected "foobar" to have been called with 1, 2, 3 exactly 1 time(s)

Existing expectations:
 - 1, 2, 3 returns 1 exactly 1 time(s)
 - 4, 5, 6 returns 2 exactly 1 time(s)`
        );
      });
    });

    describe('UnmetApplyExpectationError', () => {
      it('e2e', () => {
        const error = new UnmetApplyExpectationError(
          new MethodExpectation([], 1),
          [new MethodExpectation([], 1), new MethodExpectation([], 2)]
        );

        expectEqualAnsiless(
          error.message,
          `Expected function to have been called with "0 arguments" exactly 1 time(s)

Existing expectations:
 - "0 arguments" returns 1 exactly 1 time(s)
 - "0 arguments" returns 2 exactly 1 time(s)`
        );
      });
    });

    describe('UnmetPropertyExpectationError', () => {
      it('e2e', () => {
        const error = new UnmetPropertyExpectationError(
          'foobar',
          new PropertyExpectation(1),
          [new PropertyExpectation(1), new PropertyExpectation(2)]
        );

        expectEqualAnsiless(
          error.message,
          `Expected foobar to have been accessed exactly 1 time(s)

Existing expectations:
 - returns 1 exactly 1 time(s)
 - returns 2 exactly 1 time(s)`
        );
      });
    });

    describe('MethodExpectation', () => {
      it('e2e', () => {
        const expectation = new MethodExpectation([], 2);

        expectEqualAnsiless(
          expectation.toString(),
          '"0 arguments" returns 2 exactly 1 time(s)'
        );
      });

      it('should contain the primitive arguments', () => {
        const expectation = new MethodExpectation([1, 2, 3], 2);

        expectContainAnsiless(expectation.toString(), '1, 2, 3');
      });

      it('should contain the array arguments', () => {
        const expectation = new MethodExpectation([[1, 2, 3]], 2);

        expectContainAnsiless(expectation.toString(), '[1, 2, 3]');
      });

      it('should contain the object arguments', () => {
        const expectation = new MethodExpectation([{ foo: 'bar' }], 2);

        expectContainAnsiless(expectation.toString(), '{"foo": "bar"}');
      });

      it('should contain primitive return value', () => {
        const expectation = new MethodExpectation([], 23);

        expectContainAnsiless(expectation.toString(), 'returns 23');
      });

      it('should contain array return value', () => {
        const expectation = new MethodExpectation([], [1, 2, 3]);

        expectContainAnsiless(expectation.toString(), 'returns [1, 2, 3]');
      });

      it('should contain object return value', () => {
        const expectation = new MethodExpectation([], { foo: 'bar' });

        expectContainAnsiless(expectation.toString(), 'returns {"foo": "bar"}');
      });

      it('should contain throw message', () => {
        const expectation = new MethodExpectation([], 'foo', true);

        expectContainAnsiless(expectation.toString(), 'throws "foo"');
      });

      it('should contain throw error', () => {
        const expectation = new MethodExpectation([], new Error('foo'), true);

        expectContainAnsiless(expectation.toString(), 'throws [Error: foo]');
      });

      it('should contain the invocation count for exact', () => {
        const expectation = new MethodExpectation([], 2);
        // eslint-disable-next-line no-multi-assign
        expectation.min = expectation.max = 2;

        expectContainAnsiless(expectation.toString(), 'exactly 2 time(s)');
      });

      it('should contain the invocation count for between', () => {
        const expectation = new MethodExpectation([], 2);
        expectation.min = 2;
        expectation.max = 3;

        expectContainAnsiless(expectation.toString(), 'between 2 and 3 times');
      });

      it('should contain the invocation count for always', () => {
        const expectation = new MethodExpectation([], 2);
        expectation.min = 0;
        expectation.max = Infinity;

        expectContainAnsiless(expectation.toString(), 'at least once');
      });

      it('should shorten It.isAny', () => {
        const expectation = new MethodExpectation([It.isAny()], 2);

        expectContainAnsiless(expectation.toString(), 'any');
      });

      it('should shorten anonymous It.matches with "0 arguments"', () => {
        const expectation = new MethodExpectation([It.matches(() => true)], 2);

        expectContainAnsiless(expectation.toString(), '() => true');
      });

      it('should shorten anonymous It.matches with args', () => {
        const expectation = new MethodExpectation(
          [It.matches((x: number) => !!x)],
          2
        );

        expectContainAnsiless(expectation.toString(), '(x) => !!x');
      });
    });

    describe('PropertyExpectation', () => {
      it('e2e', () => {
        const expectation = new PropertyExpectation(2);

        expectEqualAnsiless(
          expectation.toString(),
          'returns 2 exactly 1 time(s)'
        );
      });

      it('should contain primitive return value', () => {
        const expectation = new PropertyExpectation(23);

        expectContainAnsiless(expectation.toString(), 'returns 23');
      });

      it('should contain array return value', () => {
        const expectation = new PropertyExpectation([1, 2, 3]);

        expectContainAnsiless(expectation.toString(), 'returns [1, 2, 3]');
      });

      it('should contain object return value', () => {
        const expectation = new PropertyExpectation({ foo: 'bar' });

        expectContainAnsiless(expectation.toString(), 'returns {"foo": "bar"}');
      });

      it('should contain throw message', () => {
        const expectation = new PropertyExpectation('foo', true);

        expectContainAnsiless(expectation.toString(), 'throws "foo"');
      });

      it('should contain throw error', () => {
        const expectation = new PropertyExpectation(new Error('foo'), true);

        expectContainAnsiless(expectation.toString(), 'throws [Error: foo]');
      });

      it('should contain the invocation count for exact', () => {
        const expectation = new PropertyExpectation(2);
        // eslint-disable-next-line no-multi-assign
        expectation.min = expectation.max = 2;

        expectContainAnsiless(expectation.toString(), 'exactly 2 time(s)');
      });

      it('should contain the invocation count for between', () => {
        const expectation = new PropertyExpectation(2);
        expectation.min = 2;
        expectation.max = 3;

        expectContainAnsiless(expectation.toString(), 'between 2 and 3 times');
      });

      it('should contain the invocation count for always', () => {
        const expectation = new PropertyExpectation(2);
        expectation.min = 0;
        expectation.max = Infinity;

        expectContainAnsiless(expectation.toString(), 'at least once');
      });
    });
  });
});
