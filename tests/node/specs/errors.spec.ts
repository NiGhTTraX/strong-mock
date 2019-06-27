import { describe, expect, it } from '../suite';
import { UnexpectedAccessError, UnexpectedMethodCallError } from '../../../src/errors';
import { MethodExpectation } from '../../../src/expectations';

describe('Mock', () => {
  describe('errors', () => {
    describe('UnexpectedMethodCall', () => {
      it('should contain the name of the method', () => {
        const error = new UnexpectedMethodCallError('method', [], []);

        expect(error.message).to.contain('method');
      });

      it('should contain the primitive arguments', () => {
        const error = new UnexpectedMethodCallError(':irrelevant:', [1, 2, 3], []);

        expect(error.message).to.contain('[ 1, 2, 3 ]');
      });

      it('should contain the array arguments', () => {
        const error = new UnexpectedMethodCallError(':irrelevant:', [[1, 2, 3]], []);

        expect(error.message).to.contain('[ [ 1, 2, 3 ] ]');
      });

      it('should contain the object arguments', () => {
        const error = new UnexpectedMethodCallError(':irrelevant:', [{ foo: 'bar' }], []);

        expect(error.message).to.contain('[ { foo: \'bar\' } ]');
      });

      it('should contain the expectation return value', () => {
        const error = new UnexpectedMethodCallError(':irrelevant:', [], [new MethodExpectation([], 23)]);

        expect(error.message).to.contain('=> 23');
      });

      it('should contain the expectation primitive args', () => {
        const error = new UnexpectedMethodCallError(':irrelevant:', [], [new MethodExpectation([1, 2, 3], 23)]);

        expect(error.message).to.contain('[ 1, 2, 3 ] => 23');
      });

      it('should contain the expectation array args', () => {
        const error = new UnexpectedMethodCallError(':irrelevant:', [], [new MethodExpectation([[1, 2, 3]], 23)]);

        expect(error.message).to.contain('[ [ 1, 2, 3 ] ] => 23');
      });

      it('should contain the expectation object args', () => {
        const error = new UnexpectedMethodCallError(':irrelevant:', [], [new MethodExpectation([{ foo: 'bar' }], 23)]);

        expect(error.message).to.contain('[ { foo: \'bar\' } ] => 23');
      });

      it('should contain all the expectations', () => {
        const error = new UnexpectedMethodCallError(':irrelevant:', [], [
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
