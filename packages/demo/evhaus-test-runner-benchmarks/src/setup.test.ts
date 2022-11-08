import { use } from "chai";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import ChaiJestMatchers from "chai-jest-matchers";
import { afterAll, afterEach, beforeAll } from "@larsthorup/testrunner";
import { cleanup } from "@testing-library/react";

export default () => {
  beforeAll(() => {
    use(ChaiJestMatchers);
    GlobalRegistrator.register();
  });
  afterAll(() => {
    GlobalRegistrator.unregister();
  });
  afterEach(cleanup);
};
