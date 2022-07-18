import { strict as assert } from "node:assert";
import process from "node:process";
import { describe, it } from "@larsthorup/testrunner";

/**
 * @param {number} a
 * @param {number} b
 */
export const add = (a, b) => a + b;

if (process.env.IS_TEST) {
  describe("in-source", () => {
    describe("add", () => {
      it("should add", () => {
        assert.equal(add(2, 2), 4);
      });
    });
  });
}
