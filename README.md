> Simple type safe mocking library

[![Build Status](https://travis-ci.com/NiGhTTraX/strong-mock.svg?branch=master)](https://travis-ci.com/NiGhTTraX/strong-mock) [![codecov](https://codecov.io/gh/NiGhTTraX/strong-mock/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/strong-mock) ![npm type definitions](https://img.shields.io/npm/types/strong-mock.svg)
----

## Usage

```typescript
import Mock from 'strong-mock';

interface Foo {
  bar(x: number): string;
}

const mock = new Mock<Foo>();

mock.when(f => f.bar(23)).returns('bar');

console.log(mock.object.bar(23)); // 'bar'
console.log(mock.object.bar(24)); // throws error
```
