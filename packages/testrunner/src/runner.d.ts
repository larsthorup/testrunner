import { Test } from "./collector.js";
import { ReportEvent } from "./report-event.js";

type Visit = (test: Test) => void;

export type Plugin = {
  preVisit?: Visit;
  visitBeforeChildren?: Visit;
  visitAfterChildren?: Visit;
};

export const runner: (
  root: Test,
  report: (event: ReportEvent) => void
) => Promise<void>;
