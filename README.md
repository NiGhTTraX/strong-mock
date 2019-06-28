> Simple type safe mocking library

[![Build Status](https://travis-ci.com/NiGhTTraX/strong-mock.svg?branch=master)](https://travis-ci.com/NiGhTTraX/strong-mock) [![codecov](https://codecov.io/gh/NiGhTTraX/strong-mock/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/strong-mock) ![npm type definitions](https://img.shields.io/npm/types/strong-mock.svg)
----

## Features

- _Strongly_ typed mocks from function types and class interfaces.
- Mocks are always strict.
- Useful error messages.
- Simple and expressive API.


## Limitations

- No call forwarding support.
- No setter mocking support.

If you need any of the above check other libraries like [typemoq](https://github.com/florinn/typemoq) or [ts-mockito](https://github.com/NagRock/ts-mockito).


## Requirements

strong-mock requires an environment that supports the [ES6 Proxy object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). This is necessary to create dynamic mocks from interfaces because TypeScript does not support reflection e.g. exposing the type info at runtime.


## Usage

### `Mock<T>()`

Creates a mock of type `<T>` that you can set expectations on using `when` and `returns`.

#### `.when`

Sets an expectation on the mock. If no expectations are set then this means the mock object should never be called. If it is called, then it will throw an error.

`.when` receives a callback that is passed a mock stub. Calling any methods on the stub, or accessing properties on it will set an expectation when followed by a `returns` call.

```typescript
import Mock from 'strong-mock';

interface Foo {
  bar(x: number): string;
}

const mock = new Mock<Foo>();

mock.when(f => f.bar(23)).returns('bar');
```

The above sets the following expectation:

```gherkin
Given a mock of type `Foo`
When someone calls its method `bar` with arguments `23`
Then the mock will return `bar`.
```

You can also mock function types:

```typescript
const mock = new Mock<() => number>();
mock.when(f => f()).returns(23);
console.log(mock.stub()); // 23
```

#### `.returns`

Set the return value for the chained expectation. MUST always be called after `.when` in order to set the expectation.

```typescript
mock.when(f => f.bar(23)).returns('bar'); // sets the expectation

mock.when(f => f.bar(23)); // does nothing
```

### `.stub`

Gets a stub that you can pass into code expecting the real thing.

```typescript
console.log(mock.stub.bar(23)); // 'bar'
console.log(mock.stub.bar(24)); // throws error because 24 is not expected
```

#### `.verifyAll`

Verifies that all set expectations have been met. If not, it will throw an error with details about the first unmet expectation.

```typescript
mock.when(f => f.bar(1)).returns('bar');
mock.when(f => f.bar(2)).returns('baz');

mock.stub.bar(1);

mock.verifyAll(); // will throw because `bar(2)` hasn't been called
```


#### `.reset`

Clears all expectations allowing you to start from the beginning. Useful in test setup/teardown hooks.
