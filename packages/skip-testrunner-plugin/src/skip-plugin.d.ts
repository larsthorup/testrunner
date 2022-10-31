import { Plugin } from "@larsthorup/testrunner";

declare module "@larsthorup/testrunner" {
  export interface DescribeOptions {
    skip?: boolean;
  }
  export interface ItOptions {
    skip?: boolean;
  }
}

export const plugin: () => Plugin;
export const skip: boolean;
