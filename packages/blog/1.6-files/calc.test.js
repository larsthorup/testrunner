import assert from "node:assert/strict";

import { describe, it } from "./index.js";

import { add } from "./calc.js";

describe("add", () => {
  it("should calculate the sum", () => {
    assert.equal(add(2, 2), 4);
  });
});
