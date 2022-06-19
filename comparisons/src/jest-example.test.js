/* global afterAll, afterEach, beforeAll, beforeEach, describe, it */

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
  it.failing(
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

describe('async hooks run sequentially', () => {
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
    assert.equal(order, '<([{i)>}]');
  });
});

// useSetup - simulate FILO using nested describe blocks
const useSetup = (setup) => {
  const { before, after, get } = setup();
  beforeAll(before);
  afterAll(after);
  return get;
};
describe('useSetup', () => {
  let order = [];
  describe('block', () => {
    const getDb = useSetup(() => {
      let db;
      return {
        before: () => {
          db = { some: 'db' };
          order.push('setup db');
        },
        after: () => {
          db = undefined;
          order.push('teardown db');
        },
        get: () => {
          order.push('get db');
          return db;
        },
      };
    });
    describe('nested block', () => {
      const getServer = useSetup(() => {
        let server;
        return {
          before: () => {
            const db = getDb();
            server = { db };
            order.push('setup server');
          },
          after: () => {
            server = undefined;
            order.push('teardown server');
          },
          get: () => {
            order.push('get server');
            return server;
          },
        };
      });
      it('should have setup', () => {
        const server = getServer();
        assert.deepEqual(server, { db: { some: 'db' } });
        order.push('test');
      });
    });
  });
  afterAll(() => {
    assert.deepEqual(order, [
      'setup db',
      'get db',
      'setup server',
      'get server',
      'test',
      'teardown server',
      'teardown db',
    ]);
  });
});

// useSetup, composition - have to compose nested describe blocks?

describe('mark test expected to fail', () => {
  it.failing('should fail', () => {
    assert.equal(2 + 2, 5);
  });

  // mark test expected to fail with specific message - not available in jest
});

describe('skip', () => {
  it.skip('should allow a test to bail out', () => {
    assert.equal(2 + 2, 5);
  });
  // dynamic skip not available in jest
});
