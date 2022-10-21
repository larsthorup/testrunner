import { strict as assert } from "node:assert";

import { describe, it } from "@larsthorup/testrunner";

import add from "./dep.js";

describe("affected", () => {
  it("should add with lib", async () => {
    assert.equal(add(2, 2), 4);
  });
});
