import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { instance } from '../src';
import { UnexpectedCall } from '../src/errors';
import { Expectation } from '../src/expectation';
import { FIFORepository } from '../src/expectation-repository';
import { ApplyProp, strongMock } from '../src/mock';
import { EmptyRepository } from './expectation-repository';

// TODO: decouple tests from FIFORepository
describe('instance', () => {
  it('should get matching expectation for apply', () => {
    const repo = new FIFORepository();
    const fn = strongMock<(x: number) => number>(repo);

    repo.add(new Expectation(ApplyProp, [1], 2));

    expect(instance(fn)(1)).toEqual(2);
  });

  it('should get matching expectation for method', () => {
    const repo = new FIFORepository();
    const foo = strongMock<{ bar: (x: number) => number }>(repo);

    repo.add(new Expectation('bar', [1], 2));

    expect(instance(foo).bar(1)).toEqual(2);
  });

  it('should get matching expectation for property', () => {
    const repo = new FIFORepository();
    const foo = strongMock<{ bar: number }>(repo);

    repo.add(new Expectation('bar', undefined, 23));

    expect(instance(foo).bar).toEqual(23);
  });

  it('should throw if no expectation for property', () => {
    const repo = new EmptyRepository();
    const foo = strongMock<{ bar: number }>(repo);

    expect(() => instance(foo).bar).toThrow(UnexpectedCall);
  });

  it('should throw if no expectation for method', () => {
    const repo = new EmptyRepository();
    const foo = strongMock<{ bar: () => void }>(repo);

    expect(() => instance(foo).bar()).toThrow(UnexpectedCall);
  });

  it('get matching expectation for property before method', () => {
    const repo = new FIFORepository();
    const foo = strongMock<{ bar: (x: number) => number }>(repo);

    repo.add(new Expectation('bar', [13], 23));
    repo.add(new Expectation('bar', undefined, () => 42));

    expect(instance(foo).bar(-1)).toEqual(42);
    expect(instance(foo).bar(13)).toEqual(23);
  });
});
