import { describe, it } from "@larsthorup/testrunner";

describe("unrushed", () => {
  it("should take a while", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
});
