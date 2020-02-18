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

#### Type checking

#### Multiple expectations

### Mocking interface methods

### Mocking getters

### Mocking functions

### Mocking promises

### Throwing errors

### Invocation count

### Verifying expectations

### Resetting expectations

### Argument matchers
