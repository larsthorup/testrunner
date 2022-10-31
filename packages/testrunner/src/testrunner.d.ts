import { ReportEvent as ReportEventType } from "./report-event.js";
import * as Collector from "./collector.js";
import * as Runner from "./runner.js";

export type ReportEvent = ReportEventType;
export type Fn = Collector.Fn;
export type Test = Collector.Test;
export interface DescribeOptions {}
export interface ItOptions {}
export type Plugin = Runner.Plugin;
export function afterAll(nameOrFn: string | Fn, fnOrUndefined?: Fn): void;
export function afterEach(fn: Fn): void;
export function beforeAll(nameOrFn: string | Fn, fnOrUndefined?: Fn): void;
export function beforeEach(fn: Fn): void;
export function describe(
  name: string,
  optionsOrFn?: DescribeOptions | (() => void),
  fnOrUndefined?: () => void
): void;
export function it(
  name: string,
  optionsOrFn: ItOptions | Fn,
  fnOrUndefined?: Fn
): void;
export function skipIf(condition: boolean, reason?: string): void;
