import { strict as assert } from "node:assert";

import { describe, it } from "@larsthorup/testrunner";

describe("transpiling", () => {
  const a: number = 42;
  it("should calculate", () => {
    assert.equal(a + a, 84);
  });
});
