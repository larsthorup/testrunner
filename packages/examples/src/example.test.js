import { strict as assert } from 'node:assert';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
  skip,
} from '@larsthorup/testrunner';
import { expect } from 'chai';

import { fails } from './lib/fails.js';
import { useSetup } from './lib/useSetup.js';
import { timeout } from './lib/timeout.js';

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

  afterAll('verify order', () => {
    order += 'A';
    assert.equal(order, 'B1b2ab3a4A');
  });
});

describe('async', () => {
  it('should await', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(2 + 2, 4);
  });
  it(
    'should timeout',
    fails(
      timeout(() => {
        return new Promise(() => {});
      }, 50)
    )
  );
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
  afterAll('verify order', () => {
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
  afterAll('verify order', () => {
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

describe('useSetup, composition', () => {
  /** @typedef { { some: string} } Db*/
  /**
   * @returns {() => Db | undefined}
   */
  const useDb = () => {
    return useSetup(() => {
      /** @type { Db | undefined } */
      let db;
      return {
        before: () => {
          db = { some: 'db' };
        },
        after: () => {
          db = undefined;
        },
        get: () => {
          return db;
        },
      };
    });
  };
  /** @typedef { { db: Db | undefined } } Server */
  /**
   * @param {() => Db | undefined} getDb
   * @returns {() => Server | undefined}
   */
  const useServer = (getDb) => {
    return useSetup(() => {
      /** @type { Server | undefined } */
      let server;
      return {
        before: () => {
          const db = getDb();
          server = { db };
        },
        after: () => {
          server = undefined;
        },
        get: () => {
          return server;
        },
      };
    });
  };
  /**
   * @returns { {getDb: () => Db | undefined, getServer: () => Server | undefined } }
   */
  const useInfra = () => {
    const getDb = useDb();
    const getServer = useServer(getDb);
    return { getDb, getServer };
  };
  describe('block', () => {
    const { getServer } = useInfra();
    it('should have setup', () => {
      const server = getServer();
      assert.deepEqual(server, { db: { some: 'db' } });
    });
  });
});

describe('mark test expected to fail', () => {
  it(
    'should fail',
    fails(() => {
      expect(2 + 2).to.equal(5);
    })
  );

  it(
    'should fail with message',
    fails('expected 4 to equal 5', () => {
      expect(2 + 2).to.equal(5);
    })
  );
});

describe('skip', () => {
  it('should allow a test to bail out', () => {
    skip('for reasons');
    assert.equal(2 + 2, 5);
  });
});

describe('each', () => {
  [false, 0, '', null, undefined].map((value) =>
    it(`should verify falsy-ness of ${value === '' ? '""' : value}`, () => {
      assert.equal(!!value, false);
    })
  );
});
