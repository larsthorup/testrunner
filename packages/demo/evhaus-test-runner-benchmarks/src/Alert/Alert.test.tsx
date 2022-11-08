import { expect, use } from "chai";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import ChaiJestMatchers from "chai-jest-matchers";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  it,
} from "@larsthorup/testrunner";
import Alert from "./index.js";
import React from "react";
import { render, cleanup } from "@testing-library/react";

beforeAll(() => {
  use(ChaiJestMatchers);
  GlobalRegistrator.register();
});
afterAll(() => {
  GlobalRegistrator.unregister();
});
afterEach(cleanup);

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
