import { expose } from "threads/worker";
import { Observable } from "observable-fns";

import loader from "./loader.js";

/**
 * @param {string[]} testFilePaths
 */
const observableLoader = (testFilePaths) => {
  return new Observable((observer) => {
    loader(testFilePaths, observer.next.bind(observer));
  });
};

expose(observableLoader);
