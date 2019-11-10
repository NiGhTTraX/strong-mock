import { expect } from 'tdd-buffet/expect/chai';
import { describe, it } from 'tdd-buffet/suite/node';
import { It } from '../src';
import {
  UnexpectedAccessError,
  WrongApplyArgsError,
  WrongMethodArgsError
} from '../src/errors';
import { MethodExpectation, PropertyExpectation } from '../src/expectations';

describe('Mock', () => {
  describe('errors', () => {
    describe('WrongMethodArgsError', () => {
      it('e2e', () => {
        const error = new WrongMethodArgsError(
          'foobar',
          [1, 2, 3],
          [new MethodExpectation([1], 2)]
        );

        expect(error.message).to
          .equal(`foobar not expected to be called with [ 1, 2, 3 ]!

Existing expectations:
[ 1 ] returns 2 exactly 1 time(s)`);
      });

      it('should contain the name of the method', () => {
        const error = new WrongMethodArgsError('method', [], []);

        expect(error.message).to.contain('method');
      });

      it('should contain all the expectations', () => {
        const error = new WrongMethodArgsError(
          ':irrelevant:',
          [],
          [new MethodExpectation([1], 2), new MethodExpectation([3], 4)]
        );

        expect(error.message)
          .to.contain('[ 1 ] returns 2')
          .and.to.contain('[ 3 ] returns 4');
      });
    });

    describe('WrongApplyError', () => {
      it('e2e', () => {
        const error = new WrongApplyArgsError(
          [1, 2, 3],
          [new MethodExpectation([1], 2)]
        );

        expect(error.message).to
          .equal(`Function not expected to be called with [ 1, 2, 3 ]!

Existing expectations:
[ 1 ] returns 2 exactly 1 time(s)`);
      });

      it('should contain all the expectations', () => {
        const error = new WrongApplyArgsError(
          [],
          [new MethodExpectation([1], 2), new MethodExpectation([3], 4)]
        );

        expect(error.message)
          .to.contain('[ 1 ] returns 2')
          .and.to.contain('[ 3 ] returns 4');
      });
    });

    describe('UnexpectedAccessError', () => {
      it('should contain the name of the property', () => {
        const error = new UnexpectedAccessError('property');

        expect(error.message).to.contain('property');
      });
    });

    describe('MethodExpectation', () => {
      it('e2e', () => {
        const expectation = new MethodExpectation([], 2);

        expect(expectation.toString()).to.equal(
          '[] returns 2 exactly 1 time(s)'
        );
      });

      it('should contain the primitive arguments', () => {
        const expectation = new MethodExpectation([1, 2, 3], 2);

        expect(expectation.toString()).to.contain('[ 1, 2, 3 ]');
      });

      it('should contain the array arguments', () => {
        const expectation = new MethodExpectation([[1, 2, 3]], 2);

        expect(expectation.toString()).to.contain('[ [ 1, 2, 3 ] ]');
      });

      it('should contain the object arguments', () => {
        const expectation = new MethodExpectation([{ foo: 'bar' }], 2);

        expect(expectation.toString()).to.contain("[ { foo: 'bar' } ]");
      });

      it('should contain primitive return value', () => {
        const expectation = new MethodExpectation([], 23);

        expect(expectation.toString()).to.contain('returns 23');
      });

      it('should contain array return value', () => {
        const expectation = new MethodExpectation([], [1, 2, 3]);

        expect(expectation.toString()).to.contain('returns [ 1, 2, 3 ]');
      });

      it('should contain object return value', () => {
        const expectation = new MethodExpectation([], { foo: 'bar' });

        expect(expectation.toString()).to.contain("returns { foo: 'bar' }");
      });

      it('should contain throw message', () => {
        const expectation = new MethodExpectation([], 'foo', true);

        expect(expectation.toString()).to.contain("throws 'foo'");
      });

      it('should contain throw error', () => {
        const expectation = new MethodExpectation([], new Error('foo'), true);

        expect(expectation.toString()).to.contain("throws 'Error: foo'");
      });

      it('should contain the invocation count for exact', () => {
        const expectation = new MethodExpectation([], 2);
        // eslint-disable-next-line no-multi-assign
        expectation.min = expectation.max = 2;

        expect(expectation.toString()).to.contain('exactly 2 time(s)');
      });

      it('should contain the invocation count for between', () => {
        const expectation = new MethodExpectation([], 2);
        expectation.min = 2;
        expectation.max = 3;

        expect(expectation.toString()).to.contain('between 2 and 3 times');
      });

      it('should contain the invocation count for always', () => {
        const expectation = new MethodExpectation([], 2);
        expectation.min = 0;
        expectation.max = Infinity;

        expect(expectation.toString()).to.contain('at least once');
      });

      it('should shorten It.isAny', () => {
        const expectation = new MethodExpectation([It.isAny], 2);

        expect(expectation.toString()).to.contain('[ any ]');
      });

      it('should shorten anonymous It.matches with no args', () => {
        const expectation = new MethodExpectation([It.matches(() => true)], 2);

        expect(expectation.toString()).to.contain('[ () => true ]');
      });

      it('should shorten anonymous It.matches with args', () => {
        const expectation = new MethodExpectation(
          [It.matches((x: number) => !!x)],
          2
        );

        expect(expectation.toString()).to.contain('[ (x) => !!x ]');
      });
    });

    describe('PropertyExpectation', () => {
      it('e2e', () => {
        const expectation = new PropertyExpectation(2);

        expect(expectation.toString()).to.equal('returns 2 exactly 1 time(s)');
      });

      it('should contain primitive return value', () => {
        const expectation = new PropertyExpectation(23);

        expect(expectation.toString()).to.contain('returns 23');
      });

      it('should contain array return value', () => {
        const expectation = new PropertyExpectation([1, 2, 3]);

        expect(expectation.toString()).to.contain('returns [ 1, 2, 3 ]');
      });

      it('should contain object return value', () => {
        const expectation = new PropertyExpectation({ foo: 'bar' });

        expect(expectation.toString()).to.contain("returns { foo: 'bar' }");
      });

      it('should contain throw message', () => {
        const expectation = new PropertyExpectation('foo', true);

        expect(expectation.toString()).to.contain("throws 'foo'");
      });

      it('should contain throw error', () => {
        const expectation = new PropertyExpectation(new Error('foo'), true);

        expect(expectation.toString()).to.contain("throws 'Error: foo'");
      });

      it('should contain the invocation count for exact', () => {
        const expectation = new PropertyExpectation(2);
        // eslint-disable-next-line no-multi-assign
        expectation.min = expectation.max = 2;

        expect(expectation.toString()).to.contain('exactly 2 time(s)');
      });

      it('should contain the invocation count for between', () => {
        const expectation = new PropertyExpectation(2);
        expectation.min = 2;
        expectation.max = 3;

        expect(expectation.toString()).to.contain('between 2 and 3 times');
      });

      it('should contain the invocation count for always', () => {
        const expectation = new PropertyExpectation(2);
        expectation.min = 0;
        expectation.max = Infinity;

        expect(expectation.toString()).to.contain('at least once');
      });
    });
  });
});
