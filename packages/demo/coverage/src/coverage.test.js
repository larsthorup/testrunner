import { strict as assert } from "node:assert";

import { describe, it } from "@larsthorup/testrunner";

import { add } from "./calc.js";
// import { sub } from "./calc.js";

describe("calc", () => {
  describe(add.name, () => {
    it("should add", () => {
      assert.equal(add(2, 2), 4);
    });
  });

  // describe(sub.name, () => {
  //   it("should subtract", () => {
  //     assert.equal(sub(6, 2), 4);
  //   });
  // });
});
