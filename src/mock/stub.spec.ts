// noinspection JSVoidFunctionReturnValueUsed

import { Baz, Fn, Foo } from '../../tests/fixtures';
import { SM } from '../../tests/old';
import { NestedWhen } from '../errors';
import { ApplyProp } from '../expectation/expectation';
import { ExpectationRepository } from '../expectation/repository/expectation-repository';
import { PendingExpectation } from '../when/pending-expectation';
import { Mode } from './mock';
import { createStub } from './stub';

describe('createStub', () => {
  describe('recording', () => {
    // TODO: this smells because we're not using one of the parameters in all these tests
    const repo = SM.mock<ExpectationRepository>();
    const pendingExpectation = SM.mock<PendingExpectation>();

    const expectMode = () => Mode.EXPECT;

    it('should intercept fn(...args)', () => {
      const stub = createStub<Fn>(
        SM.instance(repo),
        SM.instance(pendingExpectation),
        expectMode
      );

      SM.when(pendingExpectation.setProperty(ApplyProp)).thenReturn();
      SM.when(pendingExpectation.setArgs([1, 2, 3])).thenReturn();

      stub(1, 2, 3);
    });

    it('should intercept foo.bar(...args)', () => {
      const stub = createStub<Foo>(
        SM.instance(repo),
        SM.instance(pendingExpectation),
        expectMode
      );

      SM.when(pendingExpectation.setProperty('bar')).thenReturn();
      SM.when(pendingExpectation.setArgs([1, 2, 3])).thenReturn();

      stub.bar(1, 2, 3);
    });

    it('should throw on nested access', () => {
      const stub = createStub<Baz>(
        SM.instance(repo),
        SM.instance(pendingExpectation),
        expectMode
      );

      SM.when(pendingExpectation.setProperty('foo')).thenReturn().twice();

      expect(() => stub.foo.bar).toThrow(NestedWhen);
      expect(() => stub.foo.bar.baz).toThrow(NestedWhen);
    });

    it('should throw when spreading', () => {
      const stub = createStub<Fn>(
        SM.instance(repo),
        SM.instance(pendingExpectation),
        expectMode
      );

      expect(() => ({ ...stub })).toThrow();
    });

    it('should throw when spreading a property', () => {
      const stub = createStub<Foo>(
        SM.instance(repo),
        SM.instance(pendingExpectation),
        expectMode
      );

      SM.when(pendingExpectation.setProperty('bar')).thenReturn();

      expect(() => ({ ...stub.bar })).toThrow();
    });
  });

  describe('not recording', () => {
    const repo = SM.mock<ExpectationRepository>();
    // TODO: this smells because we're not using one of the parameters in all these tests
    const unusedPendingExpectation = SM.mock<PendingExpectation>();

    const callMode = () => Mode.CALL;

    it('should get matching expectation for apply', () => {
      SM.when(repo.apply([1])).thenReturn(42);

      const fn = createStub<(x: number) => number>(
        SM.instance(repo),
        unusedPendingExpectation,
        callMode
      );

      expect(fn(1)).toEqual(42);
    });

    it('should get matching expectation for method', () => {
      SM.when(repo.get('bar')).thenReturn(() => 42);

      const foo = createStub<{ bar: (x: number) => number }>(
        SM.instance(repo),
        unusedPendingExpectation,
        callMode
      );

      expect(foo.bar(1)).toEqual(42);
    });

    it('should get matching expectation for property', () => {
      SM.when(repo.get('bar')).thenReturn(42);

      const foo = createStub<{ bar: number }>(
        SM.instance(repo),
        unusedPendingExpectation,
        callMode
      );

      expect(foo.bar).toEqual(42);
    });

    it('should be spreadable', () => {
      const baz = Symbol('baz');
      const keys = ['foo', 'bar', baz];

      SM.when(repo.getAllProperties()).thenReturn(keys).times(4);
      SM.when(repo.get('foo')).thenReturn(1);
      SM.when(repo.get('bar')).thenReturn(2);
      SM.when(repo.get(baz)).thenReturn(3);

      const foo = createStub<{ foo: number; bar: number; [baz]: number }>(
        SM.instance(repo),
        unusedPendingExpectation,
        callMode
      );

      expect({ ...foo }).toEqual({ foo: 1, bar: 2, [baz]: 3 });
    });
  });
});
