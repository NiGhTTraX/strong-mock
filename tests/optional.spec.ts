import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import StrongMock from '../src/mock';

describe('Mock', () => {
  describe('optional arguments', () => {
    it('optional arg and passed', () => {
      type Foo = (x?: number) => number;

      const mock = new StrongMock<Foo>();
      mock.when(f => f(1)).returns(2);

      expect(mock.stub(1)).toEqual(2);
    });

    it('optional arg and missing', () => {
      type Foo = (x?: number) => number;

      const mock = new StrongMock<Foo>();
      mock.when(f => f()).returns(3);

      expect(mock.stub()).toEqual(3);
    });

    it('optional arg and passed undefined', () => {
      type Foo = (x?: number) => number;

      const mock = new StrongMock<Foo>();
      mock.when(f => f()).returns(4);

      expect(mock.stub(undefined)).toEqual(4);
    });

    it('optional arg and expected undefined and missing', () => {
      type Foo = (x?: number) => number;

      const mock = new StrongMock<Foo>();
      mock.when(f => f(undefined)).returns(4);

      expect(mock.stub()).toEqual(4);
    });

    it('optional arg and expected undefined and passed undefined', () => {
      type Foo = (x?: number) => number;

      const mock = new StrongMock<Foo>();
      mock.when(f => f(undefined)).returns(4);

      expect(mock.stub(undefined)).toEqual(4);
    });

    it('option arg not expected but passed', () => {
      type Foo = (x?: number) => number;

      const mock = new StrongMock<Foo>();
      mock.when(f => f()).returns(2);

      expect(mock.stub(1)).toEqual(2);
    });
  });
});
