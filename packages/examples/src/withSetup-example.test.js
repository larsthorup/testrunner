// @ts-nocheck // TODO

import { strict as assert } from 'node:assert';
import * as test from '@larsthorup/testrunner';

// withSetup - use describe to model a fixture
test.describe('withSetup', () => {
  let order = [];
  test.describe('block', () => {
    const withDb = (test, block) => {
      test.describe('withDb', () => {
        let db;
        test.beforeAll(() => {
          db = { some: 'db' };
          order.push('setup db');
        });
        test.afterAll(() => {
          db = undefined;
          order.push('teardown db');
        });
        block({
          ...test,
          beforeAll: (fn) => {
            test.beforeAll(() => {
              fn({ ...test, db });
            });
          },
          it: (name, fn) => {
            test.it(name, () => {
              fn({ ...test, db });
            });
          },
        });
      });
    };
    const withServer = (test, block) => {
      test.describe('withServer', () => {
        let server;
        test.beforeAll(({ db }) => {
          server = { db };
          order.push('setup server');
        });
        test.afterAll(() => {
          server = undefined;
          order.push('teardown server');
        });
        block({
          ...test,
          it: (name, fn) => {
            test.it(name, (test) => {
              fn({ ...test, server });
            });
          },
        });
      });
    };
    const withInfra = (test, block) => {
      withDb(test, (test) => {
        withServer(test, (test) => {
          block(test);
        });
      });
    };
    withInfra(test, (test) => {
      test.it('should have setup', ({ db, server }) => {
        assert.deepEqual(server, { db: { some: 'db' } });
        assert.deepEqual(db, { some: 'db' });
        order.push('test');
      });
    });
  });
  test.afterAll(() => {
    assert.deepEqual(order, [
      'setup db',
      'setup server',
      'test',
      'teardown server',
      'teardown db',
    ]);
  });
});
