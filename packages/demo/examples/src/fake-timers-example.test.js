import { strict as assert } from "node:assert";

import FakeTimers from "@sinonjs/fake-timers";
import { afterEach, beforeEach, describe, it } from "@larsthorup/testrunner";

describe("fake-timers", () => {
  describe("installed", () => {
    /** @type FakeTimers.InstalledClock */
    let clock;
    beforeEach(() => {
      clock = FakeTimers.install();
    });
    describe("setTimeout", () => {
      it("should speed up time", async () => {
        const promise = new Promise((resolve) => setTimeout(resolve, 50));
        clock.tick(50);
        await promise;
      });
    });
    describe("Date.now", () => {
      it("should fix wall time", () => {
        assert.equal(
          new Date(Date.now()).toISOString(),
          "1970-01-01T00:00:00.000Z"
        );
      });
    });
    afterEach(() => {
      clock.uninstall();
    });
  });
  describe("isolated", () => {
    /** @type FakeTimers.Clock */
    let clock;
    beforeEach(() => {
      clock = FakeTimers.createClock();
    });
    describe("setTimeout", () => {
      it("should speed up time", async () => {
        const promise = new Promise((resolve) => clock.setTimeout(resolve, 50));
        clock.tick(50);
        await promise;
      });
    });
    describe("Date.now", () => {
      it("should fix wall time", () => {
        assert.equal(
          new clock.Date(clock.Date.now()).toISOString(),
          "1970-01-01T00:00:00.000Z"
        );
      });
    });
  });
});
