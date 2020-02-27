import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { instance } from '../src';
import { Expectation } from '../src/expectation';
import { FIFORepository } from '../src/expectation-repository';
import { ApplyProp, strongMock } from '../src/mock';

// TODO: decouple tests from FIFORepository
describe('instance', () => {
  it('get matching expectation for apply', () => {
    const repo = new FIFORepository();
    const mock = strongMock<(x: number) => number>(repo);

    repo.add(new Expectation(ApplyProp, [1], 2));

    expect(instance(mock)(1)).toEqual(2);
  });

  it('get matching expectation for method', () => {
    const repo = new FIFORepository();
    const mock = strongMock<{ bar: (x: number) => number }>(repo);

    repo.add(new Expectation('bar', [1], 2));

    expect(instance(mock).bar(1)).toEqual(2);
  });

  it('get matching expectation for property', () => {
    const repo = new FIFORepository();
    const mock = strongMock<{ bar: number }>(repo);

    repo.add(new Expectation('bar', undefined, 23));

    expect(instance(mock).bar).toEqual(23);
  });

  it('get matching expectation for property method', () => {
    const repo = new FIFORepository();
    const mock = strongMock<{ bar: (x: number) => number }>(repo);

    let x = -1;

    repo.add(
      new Expectation('bar', undefined, (xArg: number) => {
        x = xArg;
        return 2;
      })
    );

    expect(instance(mock).bar(1)).toEqual(2);
    expect(x).toEqual(1);
  });

  it('get matching expectation for property before method', () => {
    const repo = new FIFORepository();
    const mock = strongMock<{ bar: (x: number) => number }>(repo);

    repo.add(new Expectation('bar', [13], 23));
    repo.add(new Expectation('bar', undefined, () => 42));

    expect(instance(mock).bar(-1)).toEqual(42);
    expect(instance(mock).bar(13)).toEqual(23);
  });
});
