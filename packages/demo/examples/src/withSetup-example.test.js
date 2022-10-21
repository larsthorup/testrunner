// @ts-nocheck // TODO

import { strict as assert } from "node:assert";
import * as test from "@larsthorup/testrunner";

// withSetup - use describe to model a composable fixture
// TODO: async
const use = (test, get, block) => {
  block({
    ...test,
    beforeAll: (fn) => {
      test.beforeAll(() => {
        fn({ ...test, ...get() });
      });
    },
    it: (name, fn) => {
      test.it(name, (test) => {
        fn({ ...test, ...get() });
      });
    },
  });
};
const withSetup = (name, setup) => {
  return (test, block) => {
    test.describe(`withSetup(${name})`, () => {
      setup({ ...test, use: (get) => use(test, get, block) });
    });
  };
};
test.describe("withSetup", () => {
  let order = [];
  test.describe("block", () => {
    const withDb = withSetup("db", (test) => {
      let db;
      test.beforeAll(() => {
        db = { some: "db" };
        order.push("setup db");
      });
      test.afterAll(() => {
        db = undefined;
        order.push("teardown db");
      });
      test.use(() => ({ db }));
    });
    const withServer = withSetup("server", (test) => {
      let server;
      test.beforeAll(({ db }) => {
        server = { db };
        order.push("setup server");
      });
      test.afterAll(() => {
        server = undefined;
        order.push("teardown server");
      });
      test.use(() => ({ server }));
    });
    const withInfra = (test, block) => {
      withDb(test, (test) => {
        withServer(test, (test) => {
          use(test, () => ({}), block);
        });
      });
    };
    withInfra(test, (test) => {
      test.it("should have setup", ({ db, server }) => {
        assert.deepEqual(server, { db: { some: "db" } });
        assert.deepEqual(db, { some: "db" });
        order.push("test");
      });
    });
  });
  test.afterAll(() => {
    assert.deepEqual(order, [
      "setup db",
      "setup server",
      "test",
      "teardown server",
      "teardown db",
    ]);
  });
});
