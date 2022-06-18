import { strict as assert } from 'node:assert';

import { describe, it } from '@larsthorup/testrunner';

import { useMockLocalStorage } from './useMockLocalStorage.js';
import localstorage from './localstorage.js';

describe('tinyspy', () => {
  useMockLocalStorage();

  it('should stub the object', () => {
    localstorage.set('name', 'Lars');
    assert.equal(localstorage.get('name'), 'Lars');
  });
});
