import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { ExpectationRepository } from '../src/expectation-repository';
import { createStub } from '../src/mock';
import { singletonPendingExpectation } from '../src/pending-expectation';

describe('createStub', () => {
  type Fn = (x: number, y: number, z: number) => number;

  interface Foo {
    bar: Fn;
  }

  it('should intercept fn(...args)', () => {
    const repo = new ExpectationRepository();
    const stub = createStub<Fn>(repo);

    stub(1, 2, 3);

    singletonPendingExpectation.finish(23);

    expect(repo.getFirst([1, 2, 3], '').returnValue).toEqual(23);
  });

  it('should intercept fn.call(this, ...args)', () => {
    const repo = new ExpectationRepository();
    const stub = createStub<Fn>(repo);

    stub.call(null, 1, 2, 3);

    singletonPendingExpectation.finish(23);

    expect(repo.getFirst([1, 2, 3], '').returnValue).toEqual(23);
  });

  it('should intercept fn.apply(this, [...args])', () => {
    const repo = new ExpectationRepository();
    const stub = createStub<Fn>(repo);

    stub.apply(null, [1, 2, 3]);

    singletonPendingExpectation.finish(23);

    expect(repo.getFirst([1, 2, 3], '').returnValue).toEqual(23);
  });

  it('should intercept Reflect.apply(fn, this, [...args])', () => {
    const repo = new ExpectationRepository();
    const stub = createStub<Fn>(repo);

    Reflect.apply(stub, null, [1, 2, 3]);

    singletonPendingExpectation.finish(23);

    expect(repo.getFirst([1, 2, 3], '').returnValue).toEqual(23);
  });

  it('should intercept fn.bind(this, ...args)', () => {
    const repo = new ExpectationRepository();
    const stub = createStub<Fn>(repo);

    stub.bind(null, 1, 2)(3);

    singletonPendingExpectation.finish(23);

    expect(repo.getFirst([1, 2, 3], '').returnValue).toEqual(23);
  });

  it('should intercept foo.bar(...args)', () => {
    const repo = new ExpectationRepository();
    const stub = createStub<Foo>(repo);

    stub.bar(1, 2, 3);

    singletonPendingExpectation.finish(23);

    expect(repo.getFirst([1, 2, 3], 'bar').returnValue).toEqual(23);
  });

  it('should intercept foo.bar.call(this, ...args)', () => {
    const repo = new ExpectationRepository();
    const stub = createStub<Foo>(repo);

    stub.bar.call(null, 1, 2, 3);

    singletonPendingExpectation.finish(23);

    expect(repo.getFirst([1, 2, 3], 'bar').returnValue).toEqual(23);
  });

  it('should intercept foo.bar.apply(this, [...args])', () => {
    const repo = new ExpectationRepository();
    const stub = createStub<Foo>(repo);

    stub.bar.apply(null, [1, 2, 3]);

    singletonPendingExpectation.finish(23);

    expect(repo.getFirst([1, 2, 3], 'bar').returnValue).toEqual(23);
  });

  it('should intercept foo.bar.bind(this, ...args)', () => {
    const repo = new ExpectationRepository();
    const stub = createStub<Foo>(repo);

    stub.bar.bind(null, 1, 2)(3);

    singletonPendingExpectation.finish(23);

    expect(repo.getFirst([1, 2, 3], 'bar').returnValue).toEqual(23);
  });
});
