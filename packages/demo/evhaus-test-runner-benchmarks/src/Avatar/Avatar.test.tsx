import { expect } from "chai";
import { describe, it } from "@larsthorup/testrunner";
import setupTest from "../setup.test.js";
import Avatar from "./index.js";
import React from "react";
import { render } from "@testing-library/react";

setupTest();

describe("<Avatar />", () => {
  it("should render the avatar with the initials of the title", () => {
    const { getByText } = render(<Avatar title="Hello World" />);
    expect(getByText("HW")).toBeDefined();
  });
});
