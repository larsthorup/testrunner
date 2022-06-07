/* global after, afterEach, before, beforeEach, describe, it */

import { strict as assert } from 'node:assert';

describe('outer', () => {
  let order = '';

  before(() => {
    order += 'B';
  });

  it('outer first', () => {
    assert.equal(2 + 2, 4);
    order += '1';
  });

  describe('inner', () => {
    beforeEach(() => {
      order += 'b';
    });

    it('inner first', () => {
      assert.equal(2 + 2, 4);
      order += '2';
    });

    it('inner last', () => {
      assert.equal(2 + 2, 4);
      order += '3';
    });

    afterEach(() => {
      order += 'a';
    });
  });

  it('outer last', () => {
    assert.equal(2 + 2, 4);
    order += '4';
  });

  after(() => {
    order += 'A';
    assert.equal(order, 'B14b2ab3aA');
  });
});

describe('async', () => {
  it('should await', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(2 + 2, 4);
  });
});
