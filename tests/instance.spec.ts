import { expect } from 'tdd-buffet/expect/jest';
import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { instance } from '../src';
import { Expectation } from '../src/expectation';
import { FIFORepository } from '../src/expectation-repository';
import { ApplyProp, MOCK_MAP, strongMock } from '../src/mock';

describe('instance', () => {
  beforeEach(() => {
    MOCK_MAP.clear();
  });

  it('get matching expectation for apply', () => {
    const mock = strongMock<(x: number) => number>();
    const repo = new FIFORepository();

    MOCK_MAP.set(mock, repo);

    repo.add(new Expectation(ApplyProp, [1], 2));

    expect(instance(mock)(1)).toEqual(2);
  });

  it('get matching expectation for method', () => {
    const mock = strongMock<{ bar: (x: number) => number }>();
    const repo = new FIFORepository();

    MOCK_MAP.set(mock, repo);

    repo.add(new Expectation('bar', [1], 2));

    expect(instance(mock).bar(1)).toEqual(2);
  });

  it('get matching expectation for property', () => {
    const mock = strongMock<{ bar: number }>();
    const repo = new FIFORepository();

    MOCK_MAP.set(mock, repo);

    repo.add(new Expectation('bar', undefined, 23));

    expect(instance(mock).bar).toEqual(23);
  });

  it('get matching expectation for property method', () => {
    const mock = strongMock<{ bar: (x: number) => number }>();
    const repo = new FIFORepository();

    let x = -1;

    MOCK_MAP.set(mock, repo);

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
    const mock = strongMock<{ bar: (x: number) => number }>();
    const repo = new FIFORepository();

    MOCK_MAP.set(mock, repo);

    repo.add(new Expectation('bar', [13], 23));
    repo.add(new Expectation('bar', undefined, () => 42));

    expect(instance(mock).bar(-1)).toEqual(42);
    expect(instance(mock).bar(13)).toEqual(23);
  });
});
