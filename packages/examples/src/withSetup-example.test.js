// @ts-nocheck // TODO

import { strict as assert } from 'node:assert';
import { afterAll, beforeAll, describe, it } from '@larsthorup/testrunner';

// withSetup - use describe to model a fixture
describe('withSetup', () => {
  let order = [];
  describe('block', () => {
    const withDb = (block) => {
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
    const withServer = (ctx, block) => {
      describe('withServer', () => {
        let server;
        ctx.beforeAll(({ db }) => {
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
      withDb((ctx) => {
        withServer(ctx, (ctx) => {
          block(ctx);
        });
      });
    };
    withInfra((ctx) => {
      ctx.it('should have setup', ({ server /* TODO: db */ }) => {
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
