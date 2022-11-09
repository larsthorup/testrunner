import { expect } from "chai";
import { describe, it } from "@larsthorup/testrunner";
import setupTest from "../setup.test.js";
import React from "react";
import { render, prettyDOM } from "@testing-library/react";
import WithTooltip from "./index.js";

setupTest();

describe("<WithTooltip />", () => {
  it("should render render nothing if no tooltip was given", () => {
    const { container } = render(
      <WithTooltip>
        <span>Howdy</span>
      </WithTooltip>
    );
    expect(prettyDOM(container, undefined, { highlight: false })).toEqual(`<div>
  <span>
    Howdy
  </span>
</div>`);
  });
});
