import { expectTypeOf, typecheck } from "@humeris/espresso-shot";
import { DescribeOptions, ItOptions } from "@larsthorup/testrunner";

typecheck("DescribeOptions", () => [
  expectTypeOf<DescribeOptions>().toBe<{
    only?: boolean | undefined;
    skip?: boolean | undefined;
  }>(),
]);

typecheck("ItOptions", () => [
  expectTypeOf<ItOptions>().toBe<{
    only?: boolean | undefined;
    skip?: boolean | undefined;
  }>(),
]);
