export type Fn = (x: number, y: number, z: number) => number;

export interface Foo {
  bar: Fn;
}

export const xxx = Symbol('xxx');

export interface Bar {
  [xxx]: number;
}

export interface Baz {
  0: number;
}
