import { afterAll, beforeAll } from '@larsthorup/testrunner';

/** @typedef { import("@larsthorup/testrunner").Fn } Fn */

/**
 * @function
 * @template T
 * @param {() => { before: Fn; after: Fn; get: () => T; } } setup
 * @returns {() => T}
 */
export const useSetup = (setup) => {
  const { before, after, get } = setup();
  beforeAll(before);
  afterAll(after);
  return get;
};
