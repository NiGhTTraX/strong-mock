import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { NestedWhen } from '../errors';
import { ApplyProp } from '../expectation/expectation';
import { RepoSideEffectPendingExpectation } from '../when/pending-expectation';
import { createStub } from './stub';
import { OneIncomingExpectationRepository } from '../expectation/repository/expectation-repository.mocks';
import { spyExpectationFactory } from '../expectation/expectation.mocks';
import { Baz, Fn, Foo } from '../../tests/fixtures';

describe('createStub', () => {
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
});
