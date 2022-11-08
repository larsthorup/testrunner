import { strict as assert } from "node:assert";
import { describe, it } from "@larsthorup/testrunner";
import { only } from "@larsthorup/only-testrunner-plugin";

describe("only", () => {
  it("should skip", () => {
    assert.equal(2 + 4, 5);
  });

  it("should allow a test to bail out other tests", { only }, () => {
    assert.equal(2 + 2, 4);
  });
});
