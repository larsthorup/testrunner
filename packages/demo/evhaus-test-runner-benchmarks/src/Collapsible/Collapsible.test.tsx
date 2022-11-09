import { expect } from "chai";
import { describe, it } from "@larsthorup/testrunner";
import setupTest from "../setup.test.js";
import { only } from "@larsthorup/only-testrunner-plugin";
import { render, waitFor } from "@testing-library/react";
import Collapsible from "./index.js";
import React from "react";
import userEvent from "@testing-library/user-event";

setupTest();

describe("<Collapsible />", () => {
  it("should render the children for the element", () => {
    const { getByText } = render(
      <Collapsible title="My Title">Hello World</Collapsible>
    );
    expect(getByText("Hello World")).toBeDefined();
  });

  it("should be able to toggle the collapsible content", async () => {
    // const user = userEvent.setup();
    const { getByText, queryByText } = render(
      <Collapsible title="My Title">Hello World</Collapsible>
    );
    expect(getByText("Hello World")).toBeDefined();

    await userEvent.click(getByText("My Title"));

    await waitFor(() => {
      expect(queryByText("Hello World")).toEqual(null);
    });
  });
});
