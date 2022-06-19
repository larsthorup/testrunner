import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from 'vitest';

import { strict as assert } from 'node:assert';
import { forTimeout } from './lib/forTimeout.js';

describe('outer', () => {
  let order = '';

  beforeAll(() => {
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

  afterAll(() => {
    order += '>';
    assert.equal(order, '<1(2)(3)4>');
  });
});

describe('async', () => {
  it('should await', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(2 + 2, 4);
  });
  it.fails(
    'should timeout',
    () => {
      return new Promise(() => {});
    },
    50
  );
});

describe('sync hooks run FIFO', () => {
  let order = '';
  describe('block', () => {
    beforeAll(() => {
      order += '<';
    });
    afterAll(() => {
      order += '>';
    });
    beforeAll(() => {
      order += '(';
    });
    afterAll(() => {
      order += ')';
    });
    it('should run all hooks', () => {
      order += '1';
    });
  });
  afterAll(() => {
    assert.equal(order, '<(1>)');
  });
});

describe('async hooks run concurrently', () => {
  let order = '';
  describe('block', () => {
    beforeAll(async () => {
      await forTimeout(20);
      order += '<';
      await forTimeout(50);
      order += '(';
    });
    beforeAll(async () => {
      order += '[';
      await forTimeout(50);
      order += '{';
    });
    afterAll(async () => {
      await forTimeout(20);
      order += ')';
      await forTimeout(50);
      order += '>';
    });
    afterAll(async () => {
      order += '}';
      await forTimeout(50);
      order += ']';
    });
    it('should run all hooks', () => {
      order += 'i';
    });
  });
  afterAll(() => {
    assert.equal(order, '[<{(i})]>');
  });
});

describe('mark test expected to fail', () => {
  it.fails('should fail', () => {
    assert.equal(2 + 2, 5);
  });

  // mark test expected to fail with specific message - not available in vitest
});

describe('skip', () => {
  it.skip('should allow a test to bail out', () => {
    assert.equal(2 + 2, 5);
  });
  // dynamic skip not available in vitest
});

describe('each', () => {
  // no way to include the iterated value in the test title?
  it.each([false, 0, '', null, undefined])(
    `should verify falsy-ness`,
    (value) => {
      assert.equal(!!value, false);
    }
  );
});
