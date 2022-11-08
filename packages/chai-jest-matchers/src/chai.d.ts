import { expect, use } from "chai";

export type Arg0<T> = T extends (arg: infer A) => unknown ? A : never;
export type ChaiPlugin = Arg0<typeof use>;
export type ChaiExpectReturn = ReturnType<typeof expect>;
export type { Assertion } from "chai";

declare global {
  export namespace Chai {
    interface Assertion {
      toBe(value: any): void;
      toBeDefined(): void;
      toEqual(value: any): void;
      toHaveLength(length: number): void;
    }
  }
}

declare const ChaiJestMatchers: (
  plugin: Chai.ChaiStatic,
  utils: Chai.ChaiUtils
) => void;
export default ChaiJestMatchers;
