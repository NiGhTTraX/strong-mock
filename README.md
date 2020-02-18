> Simple type safe mocking library

[![Build Status](https://travis-ci.com/NiGhTTraX/strong-mock.svg?branch=master)](https://travis-ci.com/NiGhTTraX/strong-mock) [![codecov](https://codecov.io/gh/NiGhTTraX/strong-mock/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/strong-mock) ![npm type definitions](https://img.shields.io/npm/types/strong-mock.svg)
----

## Features

- _Strongly_ typed mocks from interfaces.
- StrongMocks are always strict.
- Useful error messages.
- Simple and expressive API.
- Type safe argument matchers.


## Limitations

- No call forwarding support.
- No setter mocking support.

If you need any of the above check other libraries like [typemoq](https://github.com/florinn/typemoq) or [ts-mockito](https://github.com/NagRock/ts-mockito).


## Requirements

strong-mock requires an environment that supports the [ES6 Proxy object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). This is necessary to create dynamic mocks from interfaces because TypeScript does not support reflection e.g. exposing the type info at runtime.


## Usage

### Setting expectations

Expectations are set by chaining a `.when()` call with a `.returns()` call. The `.returns()` part is **mandatory** and omitting it will **not** set an expectation, even if the return value should be `undefined`. This is 
1. to prevent runtime errors where the unit under test expects a return value from the mock stub and
2. discourage side effects or at least make them explicit.

```typescript
import StrongMock from 'strong-mock';
import { expect } from 'chai';

type Foo = (x: number) => string;

function bar(foo: Foo): boolean {
  return foo(23) === 'foobar';
}

const foo = StrongMock<Foo>();
foo.when(f => f(23)); // does nothing

// Other libraries might cause this test to pass.
// strong-mock will throw instead because the
// `f(23)` expectation is not actually set.
expect(bar(foo.stub)).to.be.false;
```


#### Type checking

Since the callback in `.when()` receives a stub that is the same type you're mocking, this means that the compiler will make sure you're setting valid expectations.

However, the required type for the value in `.returns()` is inferred from the callback passed to `.when()`.

```typescript
import StrongMock from 'strong-mock';

type Foo = (x: number) => string;

const foo = StrongMock<Foo>();
foo
  .when(f => { f(23); })
  .returns(/* undefined is inferred here */);
```

Unfortunately there is no way to infer the key being accessed in `.when()` (if you do know of a way, please open an issue or a PR). This means that you should always return the value of the call you're making when setting expectations.


#### Multiple expectations

You can set multiple expectations, even with the same arguments, and they will be fulfilled in the order they were set. Once all expectations are met further calls will throw.

```typescript
import StrongMock from 'strong-mock';

const mock = StrongMock<(x: number) => string>();

mock.when(f => f(1)).returns('bar');
mock.when(f => f(1)).returns('baz');

console.log(mock.stub(1)); // 'bar'
console.log(mock.stub(1)); // 'baz'
console.log(mock.stub(1)); // throws
```


### StrongMocking interface methods

Passing an object/class interface will create a stub that mimics the properties on the interface. Since reflection is not supported in TypeScript, meaning the type information can't be read, the stub is actually an ES6 Proxy that intercepts property accesses and returns appropriate things based on the expectations that were set.

```typescript
import StrongMock from 'strong-mock';

interface Foo {
  bar(x: number): string;
  baz(): void;
}

const mock = new StrongMock<Foo>();

mock.when(f => f.bar(23)).returns('bar');

console.log(mock.stub.bar(23)); // 'bar'

// The following will throw because `baz()` is not expected
// to be called.
console.log(mock.stub.baz());
```

There's no difference in passing an interface vs passing a concrete class - the mock will use a Proxy in both cases and unexpected property access will still throw. Moreover, there is no support for forwarding calls to the concrete class.


### StrongMocking getters

You can mock properties/getters the same way as you would mock methods.

```typescript
import StrongMock from 'strong-mock';

interface Foo {
  bar: string;
}

const mock = new StrongMock<Foo>();

mock.when(f => f.bar).returns('bar');
mock.when(f => f.bar).returns('baz');

console.log(mock.stub.bar); // 'bar'
console.log(mock.stub.bar); // 'baz'
```

Note that you can't mock both a property access and a call for the same property name. **Property expectations will always have priority**.

```typescript
import StrongMock from 'strong-mock';

interface Foo {
  bar(): string;
}

const mock = new StrongMock<Foo>();

mock.when(f => f.bar).returns(() => 'bar');
mock.when(f => f.bar()).returns('baz');

console.log(mock.stub.bar()); // 'bar'
console.log(mock.stub.bar()); // throws
```


### StrongMocking functions

StrongMocking functions is similar to mocking interfaces. You can also mock properties on the function, even inherited ones.

```typescript
import StrongMock from 'strong-mock';

type Foo = () => number;

const mock = new StrongMock<Foo>();

mock.when(f => f()).returns(23);
mock.when(f => f.toString()).returns('foobar');

console.log(mock.stub()); // 23
console.log(mock.stub); // 'foobar'
```


### StrongMocking promises

```typescript
import StrongMock from 'strong-mock';

type Foo = () => Promise<number>;

const mock = new StrongMock<Foo>();

mock.when(f => f()).resolves(23);
mock.when(f => f()).returns(Promise.resolve(42));

console.log(await mock.stub()); // 23
console.log(await mock.stub()); // 42
```


### Throwing errors

You can make any expectation result in an error.

```typescript
import StrongMock from 'strong-mock';

type Foo = () => void;

const mock = new StrongMock<Foo>();

mock.when(f => f()).throws(new Error('oops'))
mock.when(f => f()).throws('oh no');

mock.stub(); // throws 'oops'
mock.stub(); // throws 'oh no'
```

You can also make promises reject in a similar way.

```typescript
import StrongMock from 'strong-mock';

type Foo = () => Promise<number>;

const mock = new StrongMock<Foo>();

mock.when(f => f()).rejects(new Error('oops'))

mock.stub(); // rejects with 'oops'
```


### Invocation count

```typescript
import StrongMock from 'strong-mock';

type Foo = () => number;

const mock = new StrongMock<Foo>();

mock.when(f => f()).returns(1).times(2);
mock.when(f => f()).returns(2).always();

mock.stub(); // 1
mock.stub(); // 1
mock.stub(); // 2
mock.stub(); // 2
```


### Verifying expectations

You can verify that all expectations have been met by calling `.verifyAll()` on the mock object. The call will throw with the first unmet expectation if there is any.

```typescript
import StrongMock from 'strong-mock';

const mock = StrongMock<(x: number) => string>();

mock.when(f => f(1)).returns('bar');
mock.when(f => f(2)).returns('baz');

mock.stub(1);

mock.verifyAll(); // will throw because `bar(2)` hasn't been called
```


### Resetting expectations

By calling `.reset()` on the mock you can clear all expectations and start from the beginning. This is useful for test setup/teardown hooks.

```typescript
import StrongMock from 'strong-mock';

const mock = StrongMock<(x: number) => string>();

mock.when(f => f(1)).returns('bar');
mock.reset();
mock.when(f => f(1)).returns('baz');

console.log(mock.stub(1)); // baz
```


### Argument matchers

When setting up the mock expectations you can ignore arguments or you can use custom matchers for them.

```typescript
import StrongMock, { It } from 'strong-mock';

const mock = new StrongMock<(x: number, y: string) => boolean>();

mock.when(f => f(It.isAny(), 'foobar')).returns(true);
mock.when(f => f(It.matches(x => x > 0), It.matches(y => y))).returns(true);

mock.stub(1, 'foobar'); // true
mock.stub(-1, 'foobar'); // throws
mock.stub(2, ''); // throws
```
