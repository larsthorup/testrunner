import { describe, it } from "@larsthorup/testrunner";
import { expect } from "chai";
import esmock from "esmock";

describe("esmock", () => {
  it("should mock service.js", async () => {
    const { getPostTitle } = await esmock("./lib.js", {
      "./service.js": {
        /**
         * @param {number} id
         * @returns
         */
        fetchPosts: async (id) =>
          Promise.resolve({ title: `some mocked title for post ${id}` }),
      },
    });
    expect(await getPostTitle(2)).toEqual("Some mocked title for post 2");
  });
});
