import { expect, test } from "@playwright/test";

const forTimeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

test.describe("outer", () => {
  let order = "";

  test.beforeAll(() => {
    order += "<";
  });

  test("outer first", () => {
    expect(2 + 2).toEqual(4);
    order += "1";
  });

  test.describe("inner", () => {
    test.beforeEach(() => {
      order += "(";
    });

    test("inner first", () => {
      expect(2 + 2).toEqual(4);
      order += "2";
    });

    test("inner last", () => {
      expect(2 + 2).toEqual(4);
      order += "3";
    });

    test.afterEach(() => {
      order += ")";
    });
  });

  test("outer last", () => {
    expect(2 + 2).toEqual(4);
    order += "4";
  });

  test.afterAll(() => {
    order += ">";
    expect(order).toEqual("<1(2)(3)4>");
  });
});

test.describe("async", () => {
  test("should await", async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(2 + 2).toEqual(4);
  });
  test("should timeout", async () => {
    test.skip();
    test.setTimeout(50);
    return new Promise(() => {});
  });
});

test.describe("sync hooks run FIFO", () => {
  let order = "";
  test.describe("block", () => {
    test.beforeAll(() => {
      order += "<";
    });
    test.afterAll(() => {
      order += ">";
    });
    test.beforeAll(() => {
      order += "(";
    });
    test.afterAll(() => {
      order += ")";
    });
    test("should run all hooks", () => {
      order += "1";
    });
  });
  test.afterAll(() => {
    expect(order).toEqual("<(1>)");
  });
});

test.describe("async hooks run sequentially", () => {
  let order = "";
  test.describe("block", () => {
    test.beforeAll(async () => {
      await forTimeout(20);
      order += "<";
      await forTimeout(50);
      order += "(";
    });
    test.beforeAll(async () => {
      order += "[";
      await forTimeout(50);
      order += "{";
    });
    test.afterAll(async () => {
      await forTimeout(20);
      order += ")";
      await forTimeout(50);
      order += ">";
    });
    test.afterAll(async () => {
      order += "}";
      await forTimeout(50);
      order += "]";
    });
    test("should run all hooks", () => {
      order += "i";
    });
  });
  test.afterAll(() => {
    expect(order).toEqual("<([{i)>}]");
  });
});

test.describe("mark test expected to fail", () => {
  test("should fail", () => {
    test.fail();
    expect(2 + 2).toEqual(5);
  });

  // mark test expected to fail with specific message - not available in vitest
});

test.describe("skip", () => {
  test("should allow a test to bail out", () => {
    test.skip();
    expect(2 + 2).toEqual(5);
  });
});

// fixture
const order = [];
type Db = { name: string };
const withDb = test.extend<{}, { name: string; db: Db }>({
  name: ["test", { scope: "worker" }],
  db: [
    async ({ name }, use) => {
      console.log("setup db");
      order.push("setup db");
      const db = { name };
      await use(db);
      console.log("teardown db");
      order.push("teardown db");
    },
    { scope: "worker" },
  ],
});
type Server = { db: Db };
const withServer = withDb.extend<{ port: number | undefined; server: Server }>({
  port: 8000,
  server: async ({ db, port }, use) => {
    console.log("setup server");
    order.push("setup server");
    const server = { db, port };
    await use(server);
    console.log("teardown server");
    order.push("teardown server");
  },
});
withDb.use({ name: "db" });
test.describe("fixture", () => {
  withServer.describe("explicit server port", () => {
    withServer.use({ port: 8001 });
    withServer("should have setup", ({ db, server }) => {
      order.push("test");
      expect(server).toEqual({ db: { name: "db" }, port: 8001 });
      expect(db).toEqual({ name: "db" });
    });
  });
  withServer.describe("default server port", () => {
    withServer("should have setup once", ({ db, server }) => {
      order.push("test");
      expect(server).toEqual({ db: { name: "db" }, port: 8000 });
      expect(db).toEqual({ name: "db" });
    });
    withServer("should have setup twice", ({ db, server }) => {
      order.push("test");
      expect(server).toEqual({ db: { name: "db" }, port: 8000 });
      expect(db).toEqual({ name: "db" });
    });
  });
  test.afterAll(() => {
    expect(order).toEqual([
      "setup db",
      "setup server",
      "test",
      "teardown server",
      "setup server",
      "test",
      "teardown server",
      "setup server",
      "test",
      // Note: the last two are run after afterAll()...
      // 'teardown server',
      // 'teardown db',
    ]);
  });
});
