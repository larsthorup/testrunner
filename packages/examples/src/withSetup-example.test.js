// @ts-nocheck // TODO

import { strict as assert } from 'node:assert';
import { afterAll, beforeAll, describe, it } from '@larsthorup/testrunner';

// withSetup - use describe to model a fixture
describe('withSetup', () => {
  let order = [];
  describe('block', () => {
    const withDb = (test, block) => {
      describe('withDb', () => {
        let db;
        beforeAll(() => {
          db = { some: 'db' };
          order.push('setup db');
        });
        afterAll(() => {
          db = undefined;
          order.push('teardown db');
        });
        block({
          beforeAll: (fn) => {
            beforeAll(() => {
              fn({ db });
            });
          },
        });
      });
    };
    const withServer = (test, block) => {
      describe('withServer', () => {
        let server;
        test.beforeAll(({ db }) => {
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
    const withInfra = (block) => {
      withDb({}, (test) => {
        withServer(test, (test) => {
          block(test);
        });
      });
    };
    withInfra((test) => {
      test.it('should have setup', ({ server /* TODO: db */ }) => {
        assert.deepEqual(server, { db: { some: 'db' } });
        order.push('test');
      });
    });
  });
  afterAll(() => {
    assert.deepEqual(order, [
      'setup db',
      'setup server',
      'test',
      'teardown server',
      'teardown db',
    ]);
  });
});
