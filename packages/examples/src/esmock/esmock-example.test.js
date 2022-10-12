import { describe, it } from "@larsthorup/testrunner";
import { expect } from "chai";
import esmock from "esmock";
import serviceMock from "./service.mock.js";
import fsMock from "./fs.mock.js";

describe("esmock", () => {
  it("should mock service.js", async () => {
    const { getPostTitle } = await esmock(
      "./lib.js",
      {
        "./service.js": serviceMock,
      },
      {
        "fs/promises": fsMock,
      }
    );
    expect(await getPostTitle(2)).toEqual("Some mocked title for post 2");
    expect(fsMock.appendFile.calls).toEqual([
      ["log.log", "LOG getPostTitle\n"],
    ]);
  });
});
