import { deepEquals } from './deep-equals';
import { is } from './is';
import { isAny } from './is-any';
import { isArray } from './is-array';
import { isNumber } from './is-number';
import { isObject } from './is-object';
import { isString } from './is-string';
import { matches } from './matcher';
import { willCapture } from './will-capture';

/**
 * Contains argument matchers that can be used to ignore arguments in an
 * expectation or to match complex arguments.
 */
export const It = {
  matches,
  deepEquals,
  is,
  isAny,
  isObject,
  isNumber,
  isString,
  isArray,
  willCapture,
};
