// @ts-nocheck // TODO

import { strict as assert } from 'node:assert';
import { afterAll, beforeAll, describe, it } from '@larsthorup/testrunner';

// withSetup - use describe to model a fixture
const useSetup = (setup) => {
  const { before, after, get } = setup();
  beforeAll(before);
  afterAll(after);
  return get;
};
describe('withSetup', () => {
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
    const withServer = (block) => {
      describe('withServer', () => {
        let server;
        beforeAll(() => {
          const db = getDb();
          server = { db };
          order.push('setup server');
        });
        afterAll(() => {
          server = undefined;
          order.push('teardown server');
        });
        block({
          it: (name, fn) => {
            it(name, () => {
              fn({ server });
            });
          },
        });
      });
    };
    withServer(({ it }) => {
      it('should have setup', ({ server }) => {
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
      'test',
      'teardown server',
      'teardown db',
    ]);
  });
});
