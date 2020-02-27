import { expect } from 'tdd-buffet/expect/jest';
import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { instance } from '../src';
import { Expectation } from '../src/expectation';
import { FIFORepository } from '../src/expectation-repository';
import { ApplyProp, MockMap, strongMock } from '../src/mock';

describe('instance', () => {
  beforeEach(() => {
    MockMap.clear();
  });

  it('get matching expectation for apply', () => {
    const mock = strongMock<(x: number) => number>();
    const repo = new FIFORepository();

    MockMap.set(mock, repo);

    repo.add(new Expectation([1], 2, ApplyProp));

    expect(instance(mock)(1)).toEqual(2);
  });

  it('get matching expectation for method', () => {
    const mock = strongMock<{ bar: (x: number) => number }>();
    const repo = new FIFORepository();

    MockMap.set(mock, repo);

    repo.add(new Expectation([1], 2, 'bar'));

    expect(instance(mock).bar(1)).toEqual(2);
  });

  it('get matching expectation for property', () => {
    const mock = strongMock<{ bar: number }>();
    const repo = new FIFORepository();

    MockMap.set(mock, repo);

    repo.add(new Expectation(undefined, 23, 'bar'));

    expect(instance(mock).bar).toEqual(23);
  });

  it('get matching expectation for property method', () => {
    const mock = strongMock<{ bar: (x: number) => number }>();
    const repo = new FIFORepository();

    let x = -1;

    MockMap.set(mock, repo);

    repo.add(
      new Expectation(
        undefined,
        (xArg: number) => {
          x = xArg;
          return 2;
        },
        'bar'
      )
    );

    expect(instance(mock).bar(1)).toEqual(2);
    expect(x).toEqual(1);
  });

  it('get matching expectation for property before method', () => {
    const mock = strongMock<{ bar: (x: number) => number }>();
    const repo = new FIFORepository();

    MockMap.set(mock, repo);

    repo.add(new Expectation([13], 23, 'bar'));
    repo.add(new Expectation(undefined, () => 42, 'bar'));

    expect(instance(mock).bar(-1)).toEqual(42);
    expect(instance(mock).bar(13)).toEqual(23);
  });
});
