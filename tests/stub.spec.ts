import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { DeepComparisonExpectation } from '../src/expectation';
import { ApplyProp, createStub } from '../src/mock';
import { PendingExpectation } from '../src/pending-expectation';
import { OneIncomingExpectationRepository } from './expectation-repository';
import { Fn, Foo } from './fixtures';

describe('createStub', () => {
  it('should intercept fn(...args)', () => {
    const repo = new OneIncomingExpectationRepository();
    const pendingExpectation = new PendingExpectation();
    const stub = createStub<Fn>(repo, pendingExpectation);

    stub(1, 2, 3);

    pendingExpectation.finish(23);

    expect(repo.expectation).toEqual(
      new DeepComparisonExpectation(ApplyProp, [1, 2, 3], 23)
    );
  });

  it('should intercept fn.call(this, ...args)', () => {
    const repo = new OneIncomingExpectationRepository();
    const pendingExpectation = new PendingExpectation();
    const stub = createStub<Fn>(repo, pendingExpectation);

    stub.call(null, 1, 2, 3);

    pendingExpectation.finish(23);

    expect(repo.expectation).toEqual(
      new DeepComparisonExpectation(ApplyProp, [1, 2, 3], 23)
    );
  });

  it('should intercept fn.apply(this, [...args])', () => {
    const repo = new OneIncomingExpectationRepository();
    const pendingExpectation = new PendingExpectation();
    const stub = createStub<Fn>(repo, pendingExpectation);

    stub.apply(null, [1, 2, 3]);

    pendingExpectation.finish(23);

    expect(repo.expectation).toEqual(
      new DeepComparisonExpectation(ApplyProp, [1, 2, 3], 23)
    );
  });

  it('should intercept Reflect.apply(fn, this, [...args])', () => {
    const repo = new OneIncomingExpectationRepository();
    const pendingExpectation = new PendingExpectation();
    const stub = createStub<Fn>(repo, pendingExpectation);

    Reflect.apply(stub, null, [1, 2, 3]);

    pendingExpectation.finish(23);

    expect(repo.expectation).toEqual(
      new DeepComparisonExpectation(ApplyProp, [1, 2, 3], 23)
    );
  });

  it('should intercept fn.bind(this, ...args)', () => {
    const repo = new OneIncomingExpectationRepository();
    const pendingExpectation = new PendingExpectation();
    const stub = createStub<Fn>(repo, pendingExpectation);

    stub.bind(null, 1, 2)(3);

    pendingExpectation.finish(23);

    expect(repo.expectation).toEqual(
      new DeepComparisonExpectation(ApplyProp, [1, 2, 3], 23)
    );
  });

  it('should intercept foo.bar(...args)', () => {
    const repo = new OneIncomingExpectationRepository();
    const pendingExpectation = new PendingExpectation();
    const stub = createStub<Foo>(repo, pendingExpectation);

    stub.bar(1, 2, 3);

    pendingExpectation.finish(23);

    expect(repo.expectation).toEqual(
      new DeepComparisonExpectation('bar', [1, 2, 3], 23)
    );
  });

  it('should intercept foo.bar.call(this, ...args)', () => {
    const repo = new OneIncomingExpectationRepository();
    const pendingExpectation = new PendingExpectation();
    const stub = createStub<Foo>(repo, pendingExpectation);

    stub.bar.call(null, 1, 2, 3);

    pendingExpectation.finish(23);

    expect(repo.expectation).toEqual(
      new DeepComparisonExpectation('bar', [1, 2, 3], 23)
    );
  });

  it('should intercept foo.bar.apply(this, [...args])', () => {
    const repo = new OneIncomingExpectationRepository();
    const pendingExpectation = new PendingExpectation();
    const stub = createStub<Foo>(repo, pendingExpectation);

    stub.bar.apply(null, [1, 2, 3]);

    pendingExpectation.finish(23);

    expect(repo.expectation).toEqual(
      new DeepComparisonExpectation('bar', [1, 2, 3], 23)
    );
  });

  it('should intercept foo.bar.bind(this, ...args)', () => {
    const repo = new OneIncomingExpectationRepository();
    const pendingExpectation = new PendingExpectation();
    const stub = createStub<Foo>(repo, pendingExpectation);

    stub.bar.bind(null, 1, 2)(3);

    pendingExpectation.finish(23);

    expect(repo.expectation).toEqual(
      new DeepComparisonExpectation('bar', [1, 2, 3], 23)
    );
  });
});
