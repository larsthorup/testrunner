import { it as test, skip } from '@larsthorup/testrunner';
import { fails } from './fails.js';
import { timeout } from './timeout.js';

/** @typedef { import("@larsthorup/testrunner").Fn } Fn */

/**
 * @param {Fn} fn
 * @param {number | undefined} [ms]
 * @returns Fn
 */
const timeoutIf = (fn, ms) => {
  if (ms !== undefined) {
    return timeout(fn, ms);
  } else {
    return fn;
  }
};

/**
 * @param {string} name
 * @param {Fn} fn
 * @param {number | undefined} [ms]
 */
export const it = (name, fn, ms) => {
  test(name, timeoutIf(fn, ms));
};

/**
 * @param {string} name
 * @param {Fn} fn
 * @param {number | undefined} [ms]
 */
it.failing = (name, fn, ms) => {
  test(name, fails(timeoutIf(fn, ms)));
};

/**
 * @param {string} name
 * @param {Fn} [fn]
 * @param {number | undefined} [ms]
 */
/* eslint-disable no-unused-vars */
it.skip = (name, fn, ms) => {
  /* eslint-enable*/
  test(name, skip);
};
