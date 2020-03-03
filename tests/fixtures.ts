export type Fn = (x: number, y: number, z: number) => number;

export interface Foo {
  bar: Fn;
}

export const uniqueSymbol = Symbol('xxx');

export interface Bar {
  [uniqueSymbol]: number;
}

export interface Baz {
  0: number;
}
