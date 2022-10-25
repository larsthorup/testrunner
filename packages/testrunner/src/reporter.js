/** @typedef {import('./report-event.js').ReportEvent} ReportEvent */

/**
 * @param {ReportEvent} event
 */
export default function reporter(event) {
  const { scope, type, data } = event;
  switch (scope) {
    case "test":
      switch (type) {
        case "skip":
          console.log("↓", data.names.join(" - "), " - ", data.message);
          break;
        case "error":
          console.log("!", data.names.join(" - "), " - ", data.message);
          break;
        case "failure":
          console.log("x", data.names.join(" - "), " - ", data.message);
          break;
        case "success":
          console.log("✔", data.names.join(" - "));
          break;
      }
      break;
  }
}
