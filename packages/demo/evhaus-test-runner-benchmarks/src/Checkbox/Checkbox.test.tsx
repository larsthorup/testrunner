import { expect } from "chai";
import { describe, it } from "@larsthorup/testrunner";
import setupTest from "../setup.test.js";
import Checkbox from "./index.js";
import React from "react";
import { render } from "@testing-library/react";

setupTest();

describe("<Checkbox />", () => {
  it("should render the checkbox", () => {
    const { getByRole } = render(<Checkbox onChange={() => {}} />);
    expect(getByRole("checkbox")).toBeDefined();
  });

  it("should support the indeterminate state", () => {
    const { getByLabelText } = render(
      <Checkbox indeterminate={true} onChange={() => {}} />
    );
    expect(getByLabelText("indeterminate")).toBeDefined();
  });
});
