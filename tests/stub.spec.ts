/* eslint-disable class-methods-use-this */
import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { Expectation } from '../src/expectation';
import { ApplyProp, createStub } from '../src/mock';
import { SINGLETON_PENDING_EXPECTATION } from '../src/pending-expectation';
import { OneIncomingExpectationRepository } from './expectation-repository';
import { Fn, Foo } from './fixtures';

describe('createStub', () => {
  it('should intercept fn(...args)', () => {
    const repo = new OneIncomingExpectationRepository();
    const stub = createStub<Fn>(repo);

    stub(1, 2, 3);

    SINGLETON_PENDING_EXPECTATION.finish(23);

    expect(repo.expectation).toEqual(new Expectation(ApplyProp, [1, 2, 3], 23));
  });

  it('should intercept fn.call(this, ...args)', () => {
    const repo = new OneIncomingExpectationRepository();
    const stub = createStub<Fn>(repo);

    stub.call(null, 1, 2, 3);

    SINGLETON_PENDING_EXPECTATION.finish(23);

    expect(repo.expectation).toEqual(new Expectation(ApplyProp, [1, 2, 3], 23));
  });

  it('should intercept fn.apply(this, [...args])', () => {
    const repo = new OneIncomingExpectationRepository();
    const stub = createStub<Fn>(repo);

    stub.apply(null, [1, 2, 3]);

    SINGLETON_PENDING_EXPECTATION.finish(23);

    expect(repo.expectation).toEqual(new Expectation(ApplyProp, [1, 2, 3], 23));
  });

  it('should intercept Reflect.apply(fn, this, [...args])', () => {
    const repo = new OneIncomingExpectationRepository();
    const stub = createStub<Fn>(repo);

    Reflect.apply(stub, null, [1, 2, 3]);

    SINGLETON_PENDING_EXPECTATION.finish(23);

    expect(repo.expectation).toEqual(new Expectation(ApplyProp, [1, 2, 3], 23));
  });

  it('should intercept fn.bind(this, ...args)', () => {
    const repo = new OneIncomingExpectationRepository();
    const stub = createStub<Fn>(repo);

    stub.bind(null, 1, 2)(3);

    SINGLETON_PENDING_EXPECTATION.finish(23);

    expect(repo.expectation).toEqual(new Expectation(ApplyProp, [1, 2, 3], 23));
  });

  it('should intercept foo.bar(...args)', () => {
    const repo = new OneIncomingExpectationRepository();
    const stub = createStub<Foo>(repo);

    stub.bar(1, 2, 3);

    SINGLETON_PENDING_EXPECTATION.finish(23);

    expect(repo.expectation).toEqual(new Expectation('bar', [1, 2, 3], 23));
  });

  it('should intercept foo.bar.call(this, ...args)', () => {
    const repo = new OneIncomingExpectationRepository();
    const stub = createStub<Foo>(repo);

    stub.bar.call(null, 1, 2, 3);

    SINGLETON_PENDING_EXPECTATION.finish(23);

    expect(repo.expectation).toEqual(new Expectation('bar', [1, 2, 3], 23));
  });

  it('should intercept foo.bar.apply(this, [...args])', () => {
    const repo = new OneIncomingExpectationRepository();
    const stub = createStub<Foo>(repo);

    stub.bar.apply(null, [1, 2, 3]);

    SINGLETON_PENDING_EXPECTATION.finish(23);

    expect(repo.expectation).toEqual(new Expectation('bar', [1, 2, 3], 23));
  });

  it('should intercept foo.bar.bind(this, ...args)', () => {
    const repo = new OneIncomingExpectationRepository();
    const stub = createStub<Foo>(repo);

    stub.bar.bind(null, 1, 2)(3);

    SINGLETON_PENDING_EXPECTATION.finish(23);

    expect(repo.expectation).toEqual(new Expectation('bar', [1, 2, 3], 23));
  });
});
