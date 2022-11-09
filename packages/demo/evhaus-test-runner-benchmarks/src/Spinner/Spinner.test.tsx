import { expect } from "chai";
import { describe, it } from "@larsthorup/testrunner";
import setupTest from "../setup.test.js";
import Spinner from "./index.js";
import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

setupTest();

describe("<Spinner />", () => {
  it("should render a spinner image", () => {
    const { getByRole } = render(<Spinner />);
    expect(getByRole("img")).toBeDefined();
  });
});
