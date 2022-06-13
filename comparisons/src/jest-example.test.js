/* global afterAll, afterEach, beforeAll, beforeEach, describe, it */

import { strict as assert } from 'node:assert';

describe('outer', () => {
  let order = '';

  beforeAll(() => {
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

  afterAll(() => {
    order += 'A';
    assert.equal(order, 'B1b2ab3a4A');
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
    beforeAll(() => {
      order += 'B';
    });
    afterAll(() => {
      order += 'A';
    });
    beforeAll(() => {
      order += 'D';
    });
    afterAll(() => {
      order += 'C';
    });
    it('should run all hooks', () => {
      order += 'i';
    });
  });
  afterAll(() => {
    assert.equal(order, 'BDiAC');
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
