import * as assert from "node:assert/strict";

import React from "react";
import { createRoot } from "react-dom/client";

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterAll, beforeAll, describe, it } from "@larsthorup/testrunner";

const h = React.createElement;

/* global document */
describe("DOM", () => {
  beforeAll(() => {
    GlobalRegistrator.register();
  });

  afterAll(() => {
    GlobalRegistrator.unregister();
  });

  it("should render some HTML", async () => {
    const appElement = document.createElement("app");
    document.body.appendChild(appElement);
    const root = createRoot(appElement);
    await new Promise((resolve) =>
      root.render(h("div", { ref: resolve }, "Test"))
    );
    assert.equal(appElement.innerHTML, "<div>Test</div>");
  });
});
