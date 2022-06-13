/* global after, afterEach, before, beforeEach, describe, it */

import { strict as assert } from 'node:assert';
import FakeTimers from '@sinonjs/fake-timers';

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

describe('hooks run FIFO', () => {
  let order = '';
  describe('block', () => {
    before(() => {
      order += 'B';
    });
    after(() => {
      order += 'A';
    });
    before(() => {
      order += 'D';
    });
    after(() => {
      order += 'C';
    });
    it('should run all hooks', () => {
      order += 'i';
    });
  });
  after(() => {
    assert.equal(order, 'BDiAC');
  });
});

describe('fake-timers', () => {
  let clock;
  beforeEach(() => {
    clock = FakeTimers.install();
  });
  describe('setTimeout', () => {
    it('should speed up time', async () => {
      try {
        const promise = new Promise((resolve) => setTimeout(resolve, 50));
        clock.tick(50);
        await promise;
      } catch (err) {
        console.error(err);
      }
    });
  });
  describe('Date.now', () => {
    it('should fix wall time', () => {
      assert.equal(
        new Date(Date.now()).toISOString(),
        '1970-01-01T00:00:00.000Z'
      );
    });
  });
  afterEach(() => {
    clock.uninstall();
  });
});

// mark test expected to fail - not available in mocha
