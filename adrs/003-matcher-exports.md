# Matcher exports

## Context

strong-mock exports a number of matchers that can be used to build complex expectations. This ADR covers the export strategy for all the matchers.

## Decision drivers

- auto-import experience: users should not have to manually type imports
- docstrings: hovering over an individual docstring should bring up its docs
- state of the art: people coming from other libraries should not abandon their habits of constructing assertions

## Considered options

### A single namespace

```typescript
import { when, It } from 'strong-mock';

when(() => fn(It.isAny()))
```

#### Pros

- good auto-import experience

#### Cons

- showing docstrings for each matcher in the namespace requires jumping through hoops with the exports

### Individual exports

```typescript
import { when, isAny } from 'strong-mock';

when(() => fn(isAny()))
```

#### Pros

- docstrings are straightforward to implement

#### Cons

- can lead to a poor auto-import experience since some of the matcher names clash with common libraries e.g. lodash

### State of the art

- jest: all matchers are nested under the `expect` namespace
- sinon: all matchers are nested under the `sinon.match` namespace

## Decision outcome

Export all matchers under a single namespace.

## Consequences

Imports inside the codebase can become inconsistent, as there will be 2 ways of importing matchers: through the individual exports, and through the namespace.
