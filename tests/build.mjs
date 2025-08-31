import assert from 'node:assert';
import { mock, when } from '../dist/index.js';

const fn = mock();
when(() => fn(42)).thenReturn(true);

assert(fn(42) === true);
