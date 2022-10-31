import React from "react";
import { render } from "@testing-library/react";

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterAll, beforeAll, describe, it } from "@larsthorup/testrunner";

describe("transpiling jsx", () => {
  beforeAll(() => {
    GlobalRegistrator.register();
  });

  afterAll(() => {
    GlobalRegistrator.unregister();
  });

  it("should render some HTML", async () => {
    const { findByText } = render(<div>Some text</div>);
    await findByText("Some text");
  });
});
