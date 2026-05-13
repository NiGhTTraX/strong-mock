import assert from 'node:assert';
// eslint-disable-next-line import-x/no-unresolved
import { mock, when } from '../dist/index.mjs';

const fn = mock();
when(() => fn(42)).thenReturn(true);

assert(fn(42) === true);
