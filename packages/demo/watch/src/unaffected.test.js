import { strict as assert } from "node:assert";

import { describe, it } from "@larsthorup/testrunner";

describe("unaffected", () => {
  it("should add", async () => {
    assert.equal(2 + 2, 4);
  });
});
