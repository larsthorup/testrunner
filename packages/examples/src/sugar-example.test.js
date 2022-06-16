import { strict as assert } from 'node:assert';

import { describe } from '@larsthorup/testrunner';
import { it } from './lib/sugar.js';

describe('sugar', () => {
  describe('it', () => {
    it('should await', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      assert.equal(2 + 2, 4);
    });
    it.failing(
      'should timeout',
      () => {
        return new Promise(() => {});
      },
      50
    );
    it.skip('should allow a test to bail out', () => {
      assert.equal(2 + 2, 5);
    });
  });
});
