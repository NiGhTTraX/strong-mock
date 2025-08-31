/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert');
const { mock, when } = require('../dist/index.cjs');

const fn = mock();
when(() => fn(42)).thenReturn(true);

assert(fn(42) === true);
