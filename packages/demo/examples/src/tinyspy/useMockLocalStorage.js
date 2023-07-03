import { spyOn } from "tinyspy";

import { afterEach, beforeEach } from "@larsthorup/testrunner";
import { useSetup } from "@larsthorup/testutils";

import localstorage from "./localstorage.js";

/**
 * @template {any[]} A
 * @template R
 * @typedef { import('tinyspy').SpyImpl<A, R> } SpyImpl<A, R>
 */

export const useMockLocalStorage = () => {
  useSetup(() => {
    /** @type { { [key: string]: string } } */
    let storage;
    /** @type { SpyImpl<[key: string, value: string], void> } */
    let setSpy;
    /** @type { SpyImpl<[key: string], string> } */
    let getSpy;

    beforeEach(() => {
      storage = {};
      setSpy = spyOn(
        localstorage,
        "set",
        (key, value) => (storage[key] = value)
      );
      getSpy = spyOn(localstorage, "get", (key) => storage[key]);
    });

    afterEach(() => {
      setSpy.restore();
      getSpy.restore();
    });

    return () => {};
  });
};
