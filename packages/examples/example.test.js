import { strict as assert } from 'node:assert';
import { describe, it } from '@larsthorup/testrunner';

describe('outer', () => {
  it('outer first', () => {
    assert.equal(2 + 2, 4);
  });
  describe('inner', () => {
    it('inner first', () => {
      assert.equal(2 + 2, 4);
    });
    it('inner last', () => {
      assert.equal(2 + 2, 4);
    });
  });
  it('outer last', () => {
    assert.equal(2 + 2, 4);
  });
});

describe('async', () => {
  it('should await', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(2 + 2, 4);
  });
});
