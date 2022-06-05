import { strict as assert } from 'node:assert';
import { describe, it } from '@larsthorup/testrunner';

describe('top-level', () => {
  it('should pass', () => {
    assert.equal(2 + 2, 4);
  });
});