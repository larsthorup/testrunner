export type Fn = () => Promise<any> | void;
export function afterAll(nameOrFn: string | Fn, fnOrUndefined?: Fn): void;
export function afterEach(fn: Fn): void;
export function beforeAll(nameOrFn: string | Fn, fnOrUndefined?: Fn): void;
export function beforeEach(fn: Fn): void;
export function describe(
  name: string,
  optionsOrFn?: Record<string, unknown> | (() => void),
  fnOrUndefined?: () => void
): void;
export function it(
  name: string,
  optionsOrFn: Record<string, unknown> | Fn,
  fnOrUndefined?: Fn
): void;
export function skip(reason?: string): void;
import { ReportEvent as ReportEventType } from "./report-event.js";
export type ReportEvent = ReportEventType;
import { Test as TestType } from "./collector.js";
export type Test = TestType;
