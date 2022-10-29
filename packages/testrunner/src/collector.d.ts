export type Fn = () => Promise<any> | void;
export type AfterAll = { type: "afterAll"; name: string; fn: Fn };
export type AfterEach = { type: "afterEach"; name: string; fn: Fn };
export type BeforeAll = { type: "beforeAll"; name: string; fn: Fn };
export type BeforeEach = { type: "beforeEach"; name: string; fn: Fn };
export type Describe = {
  type: "describe";
  name: string;
  options: Record<string, unknown>;
  testList: Test[];
};
export type It = {
  type: "it";
  name: string;
  fn: Fn;
  options: Record<string, unknown>;
};
export type Test =
  | AfterAll
  | AfterEach
  | BeforeAll
  | BeforeEach
  | Describe
  | It;
export function fileCollector(filePaths: string[]): Promise<Describe>;
export function scopeCollector(
  block: () => void | Promise<void>
): Promise<Describe>;
export class TestSkipException extends Error {}
