import { Plugin } from "@larsthorup/testrunner";

declare module "@larsthorup/testrunner" {
  export interface DescribeOptions {
    only?: boolean;
  }
  export interface ItOptions {
    only?: boolean;
  }
}

export const plugin: () => Plugin;
export const only: boolean;
