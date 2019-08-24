import { describe, expect, it } from '../suite';
import {
  UnexpectedAccessError,
  WrongApplyArgsError,
  WrongMethodArgsError
} from '../../../src/errors';
import { MethodExpectation } from '../../../src/expectations';
import { It } from '../../../src/matcher';

describe('Mock', () => {
  describe('errors', () => {
    describe('WrongMethodArgsError', () => {
      it('should contain the name of the method', () => {
        const error = new WrongMethodArgsError('method', [], []);

        expect(error.message).to.contain('method');
      });

      it('should contain the primitive arguments', () => {
        const error = new WrongMethodArgsError(':irrelevant:', [1, 2, 3], []);

        expect(error.message).to.contain('[ 1, 2, 3 ]');
      });

      it('should contain the array arguments', () => {
        const error = new WrongMethodArgsError(':irrelevant:', [[1, 2, 3]], []);

        expect(error.message).to.contain('[ [ 1, 2, 3 ] ]');
      });

      it('should contain the object arguments', () => {
        const error = new WrongMethodArgsError(':irrelevant:', [{ foo: 'bar' }], []);

        expect(error.message).to.contain('[ { foo: \'bar\' } ]');
      });

      it('should contain the expectation return value', () => {
        const error = new WrongMethodArgsError(':irrelevant:', [], [new MethodExpectation([], 23)]);

        expect(error.message).to.contain('=> 23');
      });

      it('should contain the expectation primitive args', () => {
        const error = new WrongMethodArgsError(':irrelevant:', [], [new MethodExpectation([1, 2, 3], 23)]);

        expect(error.message).to.contain('[ 1, 2, 3 ] => 23');
      });

      it('should contain the expectation array args', () => {
        const error = new WrongMethodArgsError(':irrelevant:', [], [new MethodExpectation([[1, 2, 3]], 23)]);

        expect(error.message).to.contain('[ [ 1, 2, 3 ] ] => 23');
      });

      it('should contain the expectation object args', () => {
        const error = new WrongMethodArgsError(':irrelevant:', [], [new MethodExpectation([{ foo: 'bar' }], 23)]);

        expect(error.message).to.contain('[ { foo: \'bar\' } ] => 23');
      });

      it('should contain all the expectations', () => {
        const error = new WrongMethodArgsError(':irrelevant:', [], [
          new MethodExpectation([1], 2),
          new MethodExpectation([3], 4)
        ]);

        expect(error.message).to.contain('[ 1 ] => 2').and.to.contain('[ 3 ] => 4');
      });

      it('should shorten It.isAny', () => {
        const error = new WrongMethodArgsError(':irrelevant:', [], [
          new MethodExpectation([It.isAny], 2)
        ]);

        expect(error.message).to.contain('[ any ] => 2');
      });

      it('should shorten anonymous It.matches with no args', () => {
        const error = new WrongMethodArgsError(':irrelevant:', [], [
          new MethodExpectation([It.matches(() => true)], 2)
        ]);

        expect(error.message).to.contain('[ function () { return true; } ] => 2');
      });

      it('should shorten anonymous It.matches with args', () => {
        const error = new WrongMethodArgsError(':irrelevant:', [], [
          new MethodExpectation([It.matches((x: number) => !!x)], 2)
        ]);

        expect(error.message).to.contain('[ function (x) { return !!x; } ] => 2');
      });
    });

    describe('WrongApplyError', () => {
      it('should contain the primitive arguments', () => {
        const error = new WrongApplyArgsError([1, 2, 3], []);

        expect(error.message).to.contain('[ 1, 2, 3 ]');
      });

      it('should contain the array arguments', () => {
        const error = new WrongApplyArgsError([[1, 2, 3]], []);

        expect(error.message).to.contain('[ [ 1, 2, 3 ] ]');
      });

      it('should contain the object arguments', () => {
        const error = new WrongApplyArgsError([{ foo: 'bar' }], []);

        expect(error.message).to.contain('[ { foo: \'bar\' } ]');
      });

      it('should contain the expectation return value', () => {
        const error = new WrongApplyArgsError([], [new MethodExpectation([], 23)]);

        expect(error.message).to.contain('=> 23');
      });

      it('should contain the expectation primitive args', () => {
        const error = new WrongApplyArgsError([], [new MethodExpectation([1, 2, 3], 23)]);

        expect(error.message).to.contain('[ 1, 2, 3 ] => 23');
      });

      it('should contain the expectation array args', () => {
        const error = new WrongApplyArgsError([], [new MethodExpectation([[1, 2, 3]], 23)]);

        expect(error.message).to.contain('[ [ 1, 2, 3 ] ] => 23');
      });

      it('should contain the expectation object args', () => {
        const error = new WrongApplyArgsError([], [new MethodExpectation([{ foo: 'bar' }], 23)]);

        expect(error.message).to.contain('[ { foo: \'bar\' } ] => 23');
      });

      it('should contain all the expectations', () => {
        const error = new WrongApplyArgsError([], [
          new MethodExpectation([1], 2),
          new MethodExpectation([3], 4)
        ]);

        expect(error.message).to.contain('[ 1 ] => 2').and.to.contain('[ 3 ] => 4');
      });
    });

    describe('UnexpectedAccessError', () => {
      it('should contain the name of the property', () => {
        const error = new UnexpectedAccessError('property');

        expect(error.message).to.contain('property');
      });
    });
  });
});
