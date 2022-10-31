import * as assert from "node:assert/strict";

import { skip } from "@larsthorup/skip-testrunner-plugin";
import { only } from "@larsthorup/only-testrunner-plugin";

import { scopeCollector } from "./collector.js";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
  skipIf,
} from "./testrunner.js";
import { runner } from "./runner.js";

/** @typedef {import("./report-event.js").ReportEvent} ReportEvent*/

/**
 * @param {() => void} block
 */
const runScope = async (block) => {
  const root = await scopeCollector(block);
  /** @type {ReportEvent[]} */
  let events = [];
  await runner(root, events.push.bind(events));
  return events;
};

describe("runner", () => {
  it("should run sync test", async () => {
    const events = await runScope(() => {
      it("should add", () => {
        assert.equal(2 + 2, 4);
      });
    });
    assert.deepEqual(events, [
      { scope: "test", type: "success", data: { names: ["should add"] } },
    ]);
  });

  it("should report failing test", async () => {
    const events = await runScope(() => {
      it("should add", () => {
        assert.equal(2 + 2, 5);
      });
    });
    assert.deepEqual(events, [
      {
        scope: "test",
        type: "failure",
        data: {
          names: ["should add"],
          message: "Expected values to be strictly equal:\n\n4 !== 5\n",
        },
      },
    ]);
  });

  it("should run async test", async () => {
    const events = await runScope(() => {
      it("should add", async () => {
        const sum = await new Promise((resolve) => resolve(2 + 2));
        assert.equal(sum, 4);
      });
    });
    assert.deepEqual(events, [
      { scope: "test", type: "success", data: { names: ["should add"] } },
    ]);
  });

  it("should run mixed it and describe in order", async () => {
    it("should run sync test", async () => {
      const events = await runScope(() => {
        it("should run first", () => {});
        describe("nested", () => {
          it("should run in between", () => {});
        });
        it("should run last", () => {});
      });
      assert.deepEqual(events, [
        { scope: "test", type: "success", data: { names: ["should first"] } },
        {
          scope: "test",
          type: "success",
          data: { names: ["nested", "should run in between"] },
        },
        { scope: "test", type: "success", data: { names: ["should last"] } },
      ]);
    });
  });

  it("should run hooks", async () => {
    const events = await runScope(() => {
      beforeAll(() => {});
      afterAll(() => {});
      beforeEach(() => {});
      afterEach(() => {});
      it("should test", () => {});
      it("should verify", () => {});
    });
    assert.deepEqual(events, [
      { scope: "test", type: "success", data: { names: ["beforeAll"] } },
      {
        scope: "test",
        type: "success",
        data: { names: ["should test", "beforeEach"] },
      },
      { scope: "test", type: "success", data: { names: ["should test"] } },
      {
        scope: "test",
        type: "success",
        data: { names: ["should test", "afterEach"] },
      },
      {
        scope: "test",
        type: "success",
        data: { names: ["should verify", "beforeEach"] },
      },
      { scope: "test", type: "success", data: { names: ["should verify"] } },
      {
        scope: "test",
        type: "success",
        data: { names: ["should verify", "afterEach"] },
      },
      { scope: "test", type: "success", data: { names: ["afterAll"] } },
    ]);
  });

  it("should run hooks in first-in-last-out order", async () => {
    const events = await runScope(() => {
      beforeAll("setup db", () => {});
      afterAll("teardown db", () => {});
      beforeAll("setup server", () => {});
      afterAll("teardown server", () => {});
      it("should test", () => {});
    });
    assert.deepEqual(events, [
      { scope: "test", type: "success", data: { names: ["setup db"] } },
      { scope: "test", type: "success", data: { names: ["setup server"] } },
      { scope: "test", type: "success", data: { names: ["should test"] } },
      { scope: "test", type: "success", data: { names: ["teardown server"] } },
      { scope: "test", type: "success", data: { names: ["teardown db"] } },
    ]);
  });

  it("should dynamically skip a test", async () => {
    const events = await runScope(() => {
      it("should skip", () => {
        skipIf(true, "for reasons");
      });
    });
    assert.deepEqual(events, [
      {
        scope: "test",
        type: "skip",
        data: { names: ["should skip"], message: "for reasons" },
      },
    ]);
  });

  it("should statically skip a test", async () => {
    const events = await runScope(() => {
      it("should skip", { skip }, () => {});
      it("should test", () => {});
    });
    assert.deepEqual(events, [
      {
        scope: "test",
        type: "skip",
        data: { names: ["should skip"], message: "" },
      },
      {
        scope: "test",
        type: "success",
        data: { names: ["should test"] },
      },
    ]);
  });

  it("should statically skip nested tests", async () => {
    const events = await runScope(() => {
      describe("skipped", { skip }, () => {
        it("should skip", () => {});
      });
      it("should test", () => {});
    });
    assert.deepEqual(events, [
      {
        scope: "test",
        type: "skip",
        data: { names: ["skipped", "should skip"], message: "" },
      },
      {
        scope: "test",
        type: "success",
        data: { names: ["should test"] },
      },
    ]);
  });

  it("should statically exclude other tests", async () => {
    const events = await runScope(() => {
      it("should skip", () => {});
      it("should test", { only }, () => {});
    });
    assert.deepEqual(events, [
      {
        scope: "test",
        type: "success",
        data: { names: ["should test"] },
      },
    ]);
  });

  it("should statically exclude other describes", async () => {
    const events = await runScope(() => {
      it("should skip", () => {});
      describe("included", { only }, () => {
        it("should test", () => {});
      });
    });
    assert.deepEqual(events, [
      {
        scope: "test",
        type: "success",
        data: { names: ["included", "should test"] },
      },
    ]);
  });
});
