import { strict as assert } from 'node:assert';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
  useSetup,
} from '@larsthorup/testrunner';

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

describe('hooks run FILO', () => {
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
    assert.equal(order, 'BDiCA');
  });
});

// Note: this requires FILO hook order, and will not work in mocha, vitest
describe('useSetup', () => {
  /** @type { string[] } */
  let order = [];
  describe('block', () => {
    /** @typedef { { some: string} } Db*/
    const getDb = useSetup(() => {
      /** @type { Db | undefined } */
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
    /** @typedef { { db: Db | undefined } } Server */
    const getServer = useSetup(() => {
      /** @type { Server | undefined } */
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
