/** @typedef {import('@larsthorup/testrunner').ReportEvent} ReportEvent */

/**
 * @param {ReportEvent} event
 */
export default function reporter(event) {
  const { scope, type, data } = event;
  switch (scope) {
    case "run":
      switch (type) {
        case "begin": {
          const { concurrency, fileCount } = data;
          const testFileText =
            fileCount === 1 ? "1 test file" : `${fileCount} test files`;
          if (concurrency === 1) {
            console.log(`Running ${testFileText} sequentially`);
          } else {
            console.log(
              `Running ${testFileText} with concurrency of ${concurrency}`
            );
          }
          break;
        }
        case "done": {
          const { duration, failureCount } = data;
          console.log("");
          if (failureCount === 0) {
            console.log(`✔ testrunner: all tests succeeded in ${duration} ms`);
          } else {
            const metricText =
              failureCount === 1
                ? "1 failing test"
                : `${failureCount} failing tests`;
            console.error(`x testrunner: ${metricText}`);
          }
          break;
        }
      }
      break;
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
