/** @typedef {import('./report-event.js').ReportEvent} ReportEvent */

/**
 * @param {((event: ReportEvent) => void)[]} reporters
 * @returns {(event: ReportEvent) => void}
 */
export const combineReporters = (reporters) => (event) => {
  reporters.forEach((report) => report(event));
};
