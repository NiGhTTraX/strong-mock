> Simple type safe mocking library

[![Build Status](https://travis-ci.com/NiGhTTraX/strong-mock.svg?branch=master)](https://travis-ci.com/NiGhTTraX/strong-mock) [![codecov](https://codecov.io/gh/NiGhTTraX/strong-mock/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/strong-mock) ![npm type definitions](https://img.shields.io/npm/types/strong-mock.svg)
----

## Features

- _Strongly_ typed mocks from interfaces.
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

### Setting expectations

Expectations are set by chaining a `.when()` call with a `.returns()` call. Omitting the `.returns()` call will **not** set an expectation, even if the return value should be `undefined`.

You can set multiple expectations, even with the same arguments, and they will be fulfilled in the order they were set. Once all expectations are met further calls will throw.

```typescript
import Mock from 'strong-mock';

const mock = Mock<(x: number) => string>();

mock.when(f => f(1)).returns('bar');
mock.when(f => f(1)).returns('baz');

console.log(mock.stub(1)); // 'bar'
console.log(mock.stub(1)); // 'baz'
console.log(mock.stub(1)); // throws
```


### Mocking interface methods

Passing an object/class interface will create a stub that mimics the properties on the interface. Since reflection is not supported in TypeScript, meaning the type information can't be read, the stub is actually an ES6 Proxy that intercepts property accesses and returns appropriate things based on the expectations that were set.

```typescript
import Mock from 'strong-mock';

interface Foo {
  bar(x: number): string;
  baz(): void;
}

const mock = new Mock<Foo>();

mock.when(f => f.bar(23)).returns('bar');

console.log(mock.stub.bar(23)); // 'bar'

// The following will throw because `baz()` is not expected
// to be called.
console.log(mock.stub.baz());
```

There's no difference in passing an interface vs passing a concrete class - the mock will use a Proxy in both cases and unexpected property access will still throw. Moreover, there is no support for forwarding class to the concrete class.


### Mocking getters

You can mock properties/getters the same way as you would mock methods.

```typescript
import Mock from 'strong-mock';

interface Foo {
  bar: string;
}

const mock = new Mock<Foo>();

mock.when(f => f.bar).returns('bar');
mock.when(f => f.bar).returns('baz');

console.log(mock.stub.bar); // 'bar'
console.log(mock.stub.bar); // 'baz'
```

Note that you can't mock both a property access and a call for the same property name. **Property expectations will always have priority**.

```typescript
import Mock from 'strong-mock';

interface Foo {
  bar(): string;
}

const mock = new Mock<Foo>();

mock.when(f => f.bar).returns(() => 'bar');
mock.when(f => f.bar()).returns('baz');

console.log(mock.stub.bar()); // 'bar'
console.log(mock.stub.bar()); // throws
```


### Mocking functions

Mocking functions is similar to mocking interfaces. You can even mock properties on the function, even inherited ones.

```typescript
import Mock from 'strong-mock';

type Foo = (x: number) => number;

const mock = new Mock<Foo>();

mock.when(f => f()).returns(23);
mock.when(f => f.toString()).returns('foobar');

console.log(mock.stub()); // 23
console.log(mock.stub); // 'foobar'
```


### Verifying expectations

You can verify that all expectations have been met by calling `.verifyAll()` on the mock object. The call will throw with the first unmet expectation if there are any.

```typescript
import Mock from 'strong-mock';

const mock = Mock<(x: number) => string>();

mock.when(f => f(1)).returns('bar');
mock.when(f => f(2)).returns('baz');

mock.stub(1);

mock.verifyAll(); // will throw because `bar(2)` hasn't been called
```


#### Resetting expectations

By calling `.reset()` on the mock you can clear all expectations and start from the beginning. This is useful for test setup/teardown hooks.

```typescript
import Mock from 'strong-mock';

const mock = Mock<(x: number) => string>();

mock.when(f => f(1)).returns('bar');
mock.reset();
mock.when(f => f(1)).returns('baz');

console.log(mock.stub(1)); // baz
```
