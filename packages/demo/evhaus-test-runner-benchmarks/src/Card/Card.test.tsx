import { expect } from "chai";
import { describe, it } from "@larsthorup/testrunner";
import setupTest from "../setup.test.js";
import Card from "./index.js";
import React from "react";
import { render } from "@testing-library/react";

setupTest();

describe("<Card />", () => {
  it("should render the given children", () => {
    const { getByText } = render(<Card>Hello World</Card>);
    expect(getByText("Hello World")).toBeDefined();
  });
});
