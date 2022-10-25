import { expose } from "threads/worker";
import { Observable } from "observable-fns";

import loader from "./loader.js";

/**
 * @param {string[]} testFilePaths
 */
const observableLoader = (testFilePaths) => {
  // @ts-ignore // TODO: fix
  return new Observable(async (observer) => {
    const { deps, failureCount } = await loader(
      testFilePaths,
      observer.next.bind(observer)
    );
    observer.next({
      scope: "file",
      type: "done",
      data: { deps, failureCount },
    });
    observer.complete();
  });
};

expose(observableLoader);
