import { describe, it } from "@larsthorup/testrunner";

describe("sedate", () => {
  it("should take a while", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
});
