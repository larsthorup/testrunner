import { afterAll, beforeAll } from '@larsthorup/testrunner';

// TODO: import from testrunner
/** @typedef { () => Promise<any> | void  } Fn */

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
