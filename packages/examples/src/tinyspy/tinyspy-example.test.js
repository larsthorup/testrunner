import { strict as assert } from 'node:assert';

import { spyOn } from 'tinyspy';

import { afterEach, beforeEach, describe, it } from '@larsthorup/testrunner';

import localstorage from './localstorage.js';

/**
 * @template A, R
 * @typedef { import('tinyspy').SpyImpl<A, R> } SpyImpl<A, R>
 */

describe('tinyspy', () => {
  /** @type { { [key: string]: string } } */
  let storage;
  /** @type { SpyImpl<[key: string, value: string], void> } */
  let setSpy;
  /** @type { SpyImpl<[key: string], string> } */
  let getSpy;

  // TODO: useMockLocalStorage
  beforeEach(() => {
    storage = {};
    setSpy = spyOn(localstorage, 'set', (key, value) => (storage[key] = value));
    getSpy = spyOn(localstorage, 'get', (key) => storage[key]);
  });

  afterEach(() => {
    setSpy.restore();
    getSpy.restore();
  });

  it('should stub the object', () => {
    localstorage.set('name', 'Lars');
    assert.equal(localstorage.get('name'), 'Lars');
  });
});
