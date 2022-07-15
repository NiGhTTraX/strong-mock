import { Baz, Fn, Foo } from '../../tests/fixtures';
import { SM } from '../../tests/old';
import { NestedWhen } from '../errors';
import { ApplyProp } from '../expectation/expectation';
import { spyExpectationFactory } from '../expectation/expectation.mocks';
import { ExpectationRepository } from '../expectation/repository/expectation-repository';
import { OneIncomingExpectationRepository } from '../expectation/repository/expectation-repository.mocks';
import {
  PendingExpectation,
  RepoSideEffectPendingExpectation,
} from '../when/pending-expectation';
import { createStub } from './stub';

describe('createStub', () => {
  describe('recording', () => {
    it('should intercept fn(...args)', () => {
      const repo = new OneIncomingExpectationRepository();
      const pendingExpectation = new RepoSideEffectPendingExpectation(
        spyExpectationFactory
      );
      const stub = createStub<Fn>(repo, pendingExpectation);

      stub(1, 2, 3);

      pendingExpectation.finish({ value: 23 });

      expect(repo.expectation?.property).toEqual(ApplyProp);
      expect(repo.expectation?.args).toEqual([1, 2, 3]);
      expect(repo.expectation?.returnValue.value).toEqual(23);
    });

    it('should intercept fn.call(this, ...args)', () => {
      const repo = new OneIncomingExpectationRepository();
      const pendingExpectation = new RepoSideEffectPendingExpectation(
        spyExpectationFactory
      );
      const stub = createStub<Fn>(repo, pendingExpectation);

      stub.call(null, 1, 2, 3);

      pendingExpectation.finish({ value: 23 });

      expect(repo.expectation?.property).toEqual(ApplyProp);
      expect(repo.expectation?.args).toEqual([1, 2, 3]);
      expect(repo.expectation?.returnValue.value).toEqual(23);
    });

    it('should intercept fn.apply(this, [...args])', () => {
      const repo = new OneIncomingExpectationRepository();
      const pendingExpectation = new RepoSideEffectPendingExpectation(
        spyExpectationFactory
      );
      const stub = createStub<Fn>(repo, pendingExpectation);

      stub.apply(null, [1, 2, 3]);

      pendingExpectation.finish({ value: 23 });

      expect(repo.expectation?.property).toEqual(ApplyProp);
      expect(repo.expectation?.args).toEqual([1, 2, 3]);
      expect(repo.expectation?.returnValue.value).toEqual(23);
    });

    it('should intercept Reflect.apply(fn, this, [...args])', () => {
      const repo = new OneIncomingExpectationRepository();
      const pendingExpectation = new RepoSideEffectPendingExpectation(
        spyExpectationFactory
      );
      const stub = createStub<Fn>(repo, pendingExpectation);

      Reflect.apply(stub, null, [1, 2, 3]);

      pendingExpectation.finish({ value: 23 });

      expect(repo.expectation?.property).toEqual(ApplyProp);
      expect(repo.expectation?.args).toEqual([1, 2, 3]);
      expect(repo.expectation?.returnValue.value).toEqual(23);
    });

    it('should intercept fn.bind(this, ...args)', () => {
      const repo = new OneIncomingExpectationRepository();
      const pendingExpectation = new RepoSideEffectPendingExpectation(
        spyExpectationFactory
      );
      const stub = createStub<Fn>(repo, pendingExpectation);

      stub.bind(null, 1, 2)(3);

      pendingExpectation.finish({ value: 23 });

      expect(repo.expectation?.property).toEqual(ApplyProp);
      expect(repo.expectation?.args).toEqual([1, 2, 3]);
      expect(repo.expectation?.returnValue.value).toEqual(23);
    });

    it('should intercept foo.bar(...args)', () => {
      const repo = new OneIncomingExpectationRepository();
      const pendingExpectation = new RepoSideEffectPendingExpectation(
        spyExpectationFactory
      );
      const stub = createStub<Foo>(repo, pendingExpectation);

      stub.bar(1, 2, 3);

      pendingExpectation.finish({ value: 23 });

      expect(repo.expectation?.property).toEqual('bar');
      expect(repo.expectation?.args).toEqual([1, 2, 3]);
      expect(repo.expectation?.returnValue.value).toEqual(23);
    });

    it('should intercept foo.bar.call(this, ...args)', () => {
      const repo = new OneIncomingExpectationRepository();
      const pendingExpectation = new RepoSideEffectPendingExpectation(
        spyExpectationFactory
      );
      const stub = createStub<Foo>(repo, pendingExpectation);

      stub.bar.call(null, 1, 2, 3);

      pendingExpectation.finish({ value: 23 });

      expect(repo.expectation?.property).toEqual('bar');
      expect(repo.expectation?.args).toEqual([1, 2, 3]);
      expect(repo.expectation?.returnValue.value).toEqual(23);
    });

    it('should intercept foo.bar.apply(this, [...args])', () => {
      const repo = new OneIncomingExpectationRepository();
      const pendingExpectation = new RepoSideEffectPendingExpectation(
        spyExpectationFactory
      );
      const stub = createStub<Foo>(repo, pendingExpectation);

      stub.bar.apply(null, [1, 2, 3]);

      pendingExpectation.finish({ value: 23 });

      expect(repo.expectation?.property).toEqual('bar');
      expect(repo.expectation?.args).toEqual([1, 2, 3]);
      expect(repo.expectation?.returnValue.value).toEqual(23);
    });

    it('should intercept foo.bar.bind(this, ...args)', () => {
      const repo = new OneIncomingExpectationRepository();
      const pendingExpectation = new RepoSideEffectPendingExpectation(
        spyExpectationFactory
      );
      const stub = createStub<Foo>(repo, pendingExpectation);

      stub.bar.bind(null, 1, 2)(3);

      pendingExpectation.finish({ value: 23 });

      expect(repo.expectation?.property).toEqual('bar');
      expect(repo.expectation?.args).toEqual([1, 2, 3]);
      expect(repo.expectation?.returnValue.value).toEqual(23);
    });

    it('should throw on nested access', () => {
      const repo = new OneIncomingExpectationRepository();
      const pendingExpectation = new RepoSideEffectPendingExpectation(
        spyExpectationFactory
      );
      const stub = createStub<Baz>(repo, pendingExpectation);

      expect(() => stub.foo.bar).toThrow(NestedWhen);
      expect(() => stub.foo.bar.baz).toThrow(NestedWhen);
    });

    it('should throw when spreading', () => {
      const repo = new OneIncomingExpectationRepository();
      const pendingExpectation = new RepoSideEffectPendingExpectation(
        spyExpectationFactory
      );
      const stub = createStub<Fn>(repo, pendingExpectation);

      expect(() => ({ ...stub })).toThrow();
    });

    it('should throw when spreading a property', () => {
      const repo = new OneIncomingExpectationRepository();
      const pendingExpectation = new RepoSideEffectPendingExpectation(
        spyExpectationFactory
      );
      const stub = createStub<Foo>(repo, pendingExpectation);

      expect(() => ({ ...stub.bar })).toThrow();
    });
  });

  describe('instance', () => {
    const repo = SM.mock<ExpectationRepository>();
    // TODO: this smells because we're not using one of the parameters in all these tests
    const unusedPendingExpectation = SM.mock<PendingExpectation>();

    it('should get matching expectation for apply', () => {
      SM.when(repo.get(ApplyProp)).thenReturn({ value: () => 42 });

      const fn = createStub<(x: number) => number>(
        SM.instance(repo),
        unusedPendingExpectation,
        () => false
      );

      expect(fn(1)).toEqual(42);
    });

    it('should get matching expectation for method', () => {
      SM.when(repo.get('bar')).thenReturn({ value: () => 42 });

      const foo = createStub<{ bar: (x: number) => number }>(
        SM.instance(repo),
        unusedPendingExpectation,
        () => false
      );

      expect(foo.bar(1)).toEqual(42);
    });

    it('should get matching expectation for property', () => {
      SM.when(repo.get('bar')).thenReturn({ value: 42 });

      const foo = createStub<{ bar: number }>(
        SM.instance(repo),
        unusedPendingExpectation,
        () => false
      );

      expect(foo.bar).toEqual(42);
    });

    it('should throw matching property error expectation', () => {
      SM.when(repo.get('bar')).thenReturn({ value: 'foo', isError: true });

      const foo = createStub<{ bar: number }>(
        SM.instance(repo),
        unusedPendingExpectation,
        () => false
      );

      expect(() => foo.bar).toThrow('foo');
    });

    it('should resolve matching property promise expectation', async () => {
      SM.when(repo.get('bar')).thenReturn({ value: 'foo', isPromise: true });

      const foo = createStub<{ bar: number }>(
        SM.instance(repo),
        unusedPendingExpectation,
        () => false
      );

      await expect(foo.bar).resolves.toEqual('foo');
    });

    it('should reject matching property error promise expectation', async () => {
      SM.when(repo.get('bar')).thenReturn({
        value: new Error('foo'),
        isPromise: true,
        isError: true,
      });

      const foo = createStub<{ bar: number }>(
        SM.instance(repo),
        unusedPendingExpectation,
        () => false
      );

      await expect(foo.bar).rejects.toThrow('foo');
    });

    it('should be spreadable', () => {
      const baz = Symbol('baz');
      const keys = ['foo', 'bar', baz];

      SM.when(repo.getAllProperties()).thenReturn(keys).times(4);
      SM.when(repo.get('foo')).thenReturn({ value: 1 });
      SM.when(repo.get('bar')).thenReturn({ value: 2 });
      SM.when(repo.get(baz)).thenReturn({ value: 3 });

      const foo = createStub<{ foo: number; bar: number; [baz]: number }>(
        SM.instance(repo),
        unusedPendingExpectation,
        () => false
      );

      expect({ ...foo }).toEqual({ foo: 1, bar: 2, [baz]: 3 });
    });
  });
});
