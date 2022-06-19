/* global after, afterEach, before, beforeEach, describe, it */

import { strict as assert } from 'node:assert';
import FakeTimers from '@sinonjs/fake-timers';
import { forTimeout } from './lib/forTimeout.js';

describe('outer', () => {
  let order = '';

  before(() => {
    order += '<';
  });

  it('outer first', () => {
    assert.equal(2 + 2, 4);
    order += '1';
  });

  describe('inner', () => {
    beforeEach(() => {
      order += '(';
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
      order += ')';
    });
  });

  it('outer last', () => {
    assert.equal(2 + 2, 4);
    order += '4';
  });

  after(() => {
    order += '>';
    assert.equal(order, '<14(2)(3)>');
  });
});

describe('async', () => {
  it('should await', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(2 + 2, 4);
  });
});

describe('sync hooks run FIFO', () => {
  let order = '';
  describe('block', () => {
    before(() => {
      order += '<';
    });
    after(() => {
      order += '>';
    });
    before(() => {
      order += '(';
    });
    after(() => {
      order += ')';
    });
    it('should run all hooks', () => {
      order += 'i';
    });
  });
  after(() => {
    assert.equal(order, '<(i>)');
  });
});

describe('async hooks run sequentially', () => {
  let order = '';
  describe('block', () => {
    before(async () => {
      await forTimeout(20);
      order += '<';
      await forTimeout(50);
      order += '(';
    });
    after(async () => {
      await forTimeout(20);
      order += ')';
      await forTimeout(50);
      order += '>';
    });
    before(async () => {
      order += '[';
      await forTimeout(50);
      order += '{';
    });
    after(async () => {
      order += '}';
      await forTimeout(50);
      order += ']';
    });
    it('should run all hooks', () => {
      order += 'i';
    });
  });
  after(() => {
    assert.equal(order, '<([{i)>}]');
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

describe('skip', () => {
  it('should allow a test to bail out', function () {
    this.skip('for reasons');
    assert.equal(2 + 2, 5);
  });
});
