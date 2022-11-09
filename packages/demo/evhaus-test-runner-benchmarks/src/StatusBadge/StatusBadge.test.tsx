import { expect } from "chai";
import { describe, it } from "@larsthorup/testrunner";
import setupTest from "../setup.test.js";
import React from "react";
import { render, prettyDOM } from "@testing-library/react";
import StatusBadge from "./index.js";

setupTest();

describe("<StatusBadge />", () => {
  it("should render without failure", () => {
    const { container } = render(<StatusBadge status="DRAFTED" />);
    expect(prettyDOM(container, undefined, { highlight: false })).toEqual(`<div>
  <strong
    class="main green"
    title="DRAFTED"
  >
    DRAFTED
  </strong>
</div>`);
  });
});
