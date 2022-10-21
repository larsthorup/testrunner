export type Fn = () => Promise<any> | void;
export function afterAll(nameOrFn: string | Fn, fnOrUndefined?: Fn): void;
export function afterEach(fn: Fn): void;
export function beforeAll(fn: Fn): void;
export function beforeEach(fn: Fn): void;
export function describe(name: string, fn?: () => void): void;
export function it(name: string, fn: Fn): void;
export function skip(reason?: string): void;
