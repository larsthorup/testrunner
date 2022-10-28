import React from "react";
import { render } from "@testing-library/react";

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterAll, beforeAll, describe, it } from "@larsthorup/testrunner";

const h = React.createElement;

describe("testing-library", () => {
  beforeAll(() => {
    GlobalRegistrator.register();
  });

  afterAll(() => {
    GlobalRegistrator.unregister();
  });

  it("should render some HTML", async () => {
    const { findByText } = render(h("div", {}, "Some text"));
    // TODO: screen.findByText
    await findByText("Some text");
  });
});
