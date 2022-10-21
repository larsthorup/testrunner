import { strict as assert } from "node:assert";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
  skip,
} from "@larsthorup/testrunner";

import { fails, forTimeout, timeout, useSetup } from "@larsthorup/testutils";

describe("outer", () => {
  let order = "";

  beforeAll(() => {
    order += "<";
  });

  it("outer first", () => {
    assert.equal(2 + 2, 4);
    order += "1";
  });

  describe("inner", () => {
    beforeEach(() => {
      order += "(";
    });

    it("inner first", () => {
      assert.equal(2 + 2, 4);
      order += "2";
    });

    it("inner last", () => {
      assert.equal(2 + 2, 4);
      order += "3";
    });

    afterEach(() => {
      order += ")";
    });
  });

  it("outer last", () => {
    assert.equal(2 + 2, 4);
    order += "4";
  });

  afterAll("verify order", () => {
    order += ">";
    assert.equal(order, "<1(2)(3)4>");
  });
});

describe("async", () => {
  it("should await", async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(2 + 2, 4);
  });
  it(
    "should timeout",
    fails(
      timeout(() => {
        return new Promise(() => {});
      }, 50)
    )
  );
});

describe("hooks run FILO", () => {
  let order = "";
  describe("block", () => {
    beforeAll(() => {
      order += "<";
    });
    afterAll(() => {
      order += ">";
    });
    beforeAll(() => {
      order += "(";
    });
    afterAll(() => {
      order += ")";
    });
    it("should run all hooks", () => {
      order += "1";
    });
  });
  afterAll("verify order", () => {
    assert.equal(order, "<(1)>");
  });
});

describe("async hooks run sequentially", () => {
  let order = "";
  describe("block", () => {
    beforeAll(async () => {
      await forTimeout(20);
      order += "<";
      await forTimeout(50);
      order += "(";
    });
    afterAll(async () => {
      await forTimeout(20);
      order += ")";
      await forTimeout(50);
      order += ">";
    });
    beforeAll(async () => {
      order += "[";
      await forTimeout(50);
      order += "{";
    });
    afterAll(async () => {
      order += "}";
      await forTimeout(50);
      order += "]";
    });
    it("should run all hooks", () => {
      order += "i";
    });
  });
  afterAll(() => {
    assert.equal(order, "<([{i}])>");
  });
});

// Note: this requires FILO hook order, and will not work in mocha, vitest
describe("useSetup", () => {
  /** @type { string[] } */
  let order = [];
  describe("block", () => {
    /** @typedef { { some: string} } Db*/
    const getDb = useSetup(() => {
      /** @type { Db | undefined } */
      let db;
      beforeAll(() => {
        db = { some: "db" };
        order.push("setup db");
      });
      afterAll(() => {
        db = undefined;
        order.push("teardown db");
      });
      return () => {
        order.push("get db");
        return db;
      };
    });
    /** @typedef { { db: Db | undefined } } Server */
    const getServer = useSetup(() => {
      /** @type { Server | undefined } */
      let server;
      beforeAll(() => {
        const db = getDb();
        server = { db };
        order.push("setup server");
      });
      afterAll(() => {
        server = undefined;
        order.push("teardown server");
      });
      return () => {
        order.push("get server");
        return server;
      };
    });
    it("should have setup", () => {
      const server = getServer();
      assert.deepEqual(server, { db: { some: "db" } });
      order.push("test");
    });
  });
  afterAll("verify order", () => {
    assert.deepEqual(order, [
      "setup db",
      "get db",
      "setup server",
      "get server",
      "test",
      "teardown server",
      "teardown db",
    ]);
  });
});

describe("useSetup, composition", () => {
  /** @typedef { { some: string} } Db*/
  /**
   * @returns {() => Db | undefined}
   */
  const useDb = () => {
    return useSetup(() => {
      /** @type { Db | undefined } */
      let db;
      beforeAll(() => {
        db = { some: "db" };
      });
      afterAll(() => {
        db = undefined;
      });
      return () => {
        return db;
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
      beforeAll(() => {
        const db = getDb();
        server = { db };
      });
      afterAll(() => {
        server = undefined;
      });
      return () => {
        return server;
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
  describe("block", () => {
    const { getServer } = useInfra();
    it("should have setup", () => {
      const server = getServer();
      assert.deepEqual(server, { db: { some: "db" } });
    });
  });
});

describe("mark test expected to fail", () => {
  it(
    "should fail",
    fails(() => {
      assert.equal(2 + 2, 5);
    })
  );

  it(
    "should fail with message",
    fails("Expected values to be strictly equal:\n\n4 !== 5\n", () => {
      assert.equal(2 + 2, 5);
    })
  );
});

describe("skip", () => {
  it("should allow a test to bail out", () => {
    skip("for reasons");
    assert.equal(2 + 2, 5);
  });
});

describe("each", () => {
  [false, 0, "", null, undefined].map((value) =>
    it(`should verify falsy-ness of ${value === "" ? '""' : value}`, () => {
      assert.equal(!!value, false);
    })
  );
});
