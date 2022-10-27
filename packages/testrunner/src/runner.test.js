import * as assert from "node:assert/strict";

import { scopeCollector } from "./collector.js";
import { describe, it } from "./index.js";
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
});
