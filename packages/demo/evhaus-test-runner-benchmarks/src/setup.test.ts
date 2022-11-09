import { use } from "chai";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import ChaiJestMatchers from "chai-jest-matchers";
import { afterAll, afterEach, beforeAll } from "@larsthorup/testrunner";
import { cleanup } from "@testing-library/react";

export default () => {
  beforeAll("setup happy-dom", () => {
    use(ChaiJestMatchers);
    GlobalRegistrator.register();
  });
  afterAll("cleanup happy-dom", () => {
    GlobalRegistrator.unregister();
  });
  afterEach("reset DOM", cleanup);
};
