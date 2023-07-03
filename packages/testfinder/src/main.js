import { readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

import { glob } from "glob";

const lastModificationTimeFileName = ".testfinder";

/**
 * @param {string} testFilePattern
 * @param {boolean} skipUnaffected
 * @returns {Promise<string[]>}
 */
export default async function main(testFilePattern, skipUnaffected) {
  const testFilePaths = await glob(testFilePattern, { posix: true });
  if (skipUnaffected) {
    const lastModificationTime = await loadLastModificationTime();
    const depsPerTest = await loadDeps(testFilePaths);
    const testPerDep = buildImpactMap(depsPerTest);
    const files = Object.keys(depsPerTest).concat(Object.keys(testPerDep));
    const modificationTimePerFile = await readModificationTime(files);
    const affectedTests = await findAffectedTests(
      depsPerTest,
      modificationTimePerFile,
      lastModificationTime
    );
    await saveLastModificationTime(
      lastModificationTime,
      modificationTimePerFile
    );
    return affectedTests;
  } else {
    return testFilePaths;
  }
}

/**
 * @returns {Promise<number | undefined>}
 */
async function loadLastModificationTime() {
  if (existsSync(lastModificationTimeFileName)) {
    return new Date(
      await readFile(lastModificationTimeFileName, "utf-8")
    ).getTime();
  } else {
    return undefined;
  }
}

/**
 * @param {string[]} testFilePaths
 * @returns {Promise<{[key: string]: string[] | undefined}>}
 */
async function loadDeps(testFilePaths) {
  const promises = testFilePaths.map(async (testFilePath) => {
    const depFilePath = `${testFilePath}.deps`; // TODO: share
    if (existsSync(depFilePath)) {
      const file = await readFile(depFilePath, "utf-8");
      const deps = file ? file.split("\n") : [];
      return [testFilePath, deps];
    } else {
      return [testFilePath, undefined];
    }
  });
  const entries = await Promise.all(promises);
  const depsPerTest = Object.fromEntries(entries);
  return depsPerTest;
}

/**
 * @param {{[key: string]: string[] | undefined}} depsPerTest
 * @returns {{[key: string]: string[]}}
 */
function buildImpactMap(depsPerTest) {
  /** @type {{[key: string]: string[]}} */
  const testPerDep = {};
  for (const test of Object.keys(depsPerTest)) {
    const deps = depsPerTest[test];
    if (deps) {
      for (const dep of deps) {
        testPerDep[dep] = (testPerDep[dep] || []).concat([test]);
      }
    }
  }
  return testPerDep;
}

/**
 * @param {string[]} files
 * @returns {Promise<{[key: string]: number}>}
 */
async function readModificationTime(files) {
  const modificationTimePerFile = Object.fromEntries(
    await Promise.all(
      files.map(async (file) => {
        const path = file.startsWith("file://") ? new URL(file) : file;
        const { mtimeMs } = await stat(path);
        const mtimeMsInt = Math.trunc(mtimeMs); // Note otherwise decimals will always mark files affected
        return [file, mtimeMsInt];
      })
    )
  );
  return modificationTimePerFile;
}

/**
 * @param {{[key: string]: string[] | undefined}} depsPerTest
 * @param {{[key: string]: number}} modificationTimePerFile
 * @param {number | undefined} lastModificationTime
 * @returns {string[]}
 */
function findAffectedTests(
  depsPerTest,
  modificationTimePerFile,
  lastModificationTime
) {
  const affectedTests = Object.keys(depsPerTest).filter((test) => {
    const deps = depsPerTest[test];
    if (lastModificationTime === undefined) {
      // Note: assume affected, until we we know when we ran tests the last time
      return true;
    }
    if (deps === undefined) {
      // Note: assume affected, until we have deps recorded
      return true;
    }
    const affectedBy = deps.filter(
      (dep) => modificationTimePerFile[dep] > lastModificationTime
    );
    if (affectedBy.length > 0) {
      // Note: affected if any deps was changed since last time
      const affectedByText = affectedBy.join(", ");
      console.warn(
        `Test "${test}" included because these deps have changed: [${affectedByText}]`
      );
      return true;
    }
    return false;
  });
  return affectedTests;
}

/**
 * @param {number | undefined} previousModificationTime
 * @param {{[key: string]: number}} modificationTimePerFile
 */
async function saveLastModificationTime(
  previousModificationTime,
  modificationTimePerFile
) {
  const lastModificationTime = Math.max(
    ...Object.values(modificationTimePerFile).concat(
      previousModificationTime ? [previousModificationTime] : []
    )
  );
  await writeFile(
    lastModificationTimeFileName,
    new Date(lastModificationTime).toISOString()
  );
}
