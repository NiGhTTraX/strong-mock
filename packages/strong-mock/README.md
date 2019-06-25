> Simple type safe mocking library

----

See https://github.com/NiGhTTraX/strong-mock for more details.

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
