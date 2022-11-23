import { describe, it } from "./index.js";

import { createTimer } from "./timer.js";

describe("createTimer", () => {
  it("should eventually ring", async () => {
    const timer = createTimer(50);
    await new Promise((resolve) => timer.on("ring", resolve));
  });
});
