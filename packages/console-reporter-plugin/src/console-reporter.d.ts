import { ReportEvent } from "@larsthorup/testrunner";

declare const reporter: (event: ReportEvent) => void;
export default reporter;
