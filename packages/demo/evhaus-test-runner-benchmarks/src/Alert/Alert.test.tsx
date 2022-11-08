import { expect } from "chai";
import { describe, it } from "@larsthorup/testrunner";
import setupTest from "../setup.test.js";
import Alert from "./index.js";
import React from "react";
import { render } from "@testing-library/react";

setupTest();

describe("<Alert />", () => {
  it("should render the given message", () => {
    const { getByText } = render(<Alert>Hello World</Alert>);
    expect(getByText("Hello World")).toBeDefined();
  });

  it("should render with only a title", () => {
    const { getByText } = render(<Alert title="Hello World" />);
    expect(getByText("Hello World")).toBeDefined();
  });

  it("should support all the different icons", () => {
    const { getByLabelText, rerender } = render(<Alert intent="warning" />);
    expect(getByLabelText("warning-sign")).toBeDefined();

    rerender(<Alert intent="info" />);
    expect(getByLabelText("info-sign")).toBeDefined();

    rerender(<Alert intent="success" />);
    expect(getByLabelText("tick-circle")).toBeDefined();
  });
});
