import { describe, it } from "../index.js";

describe("g", () => {
  it("should take a second", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
});
