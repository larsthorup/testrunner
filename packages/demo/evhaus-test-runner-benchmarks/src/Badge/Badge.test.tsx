import { expect } from "chai";
import { describe, it } from "@larsthorup/testrunner";
import setupTest from "../setup.test.js";
import Badge from "./index.js";
import React from "react";
import { render } from "@testing-library/react";

setupTest();

describe("<Badge />", () => {
  it("should render the given badge", () => {
    const { getByText } = render(<Badge>Hello World</Badge>);
    expect(getByText("Hello World")).toBeDefined();
  });
});
