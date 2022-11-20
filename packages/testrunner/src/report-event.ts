export type FileDone = {
  scope: "file";
  type: "deps";
  data: {
    deps?: string[];
  };
};

export type RunBegin = {
  scope: "run";
  type: "begin";
  data: { concurrency: number; fileCount: number };
};

export type RunDone = {
  scope: "run";
  type: "done";
  data: { duration: number; failureCount: number };
};

export type TestError = {
  scope: "test";
  type: "error";
  data: { names: string[]; message: string };
};

export type TestFailure = {
  scope: "test";
  type: "failure";
  data: { names: string[]; message: string };
};

export type TestSkip = {
  scope: "test";
  type: "skip";
  data: {
    names: string[];
    message: string;
  };
};

export type TestSuccess = {
  scope: "test";
  type: "success";
  data: {
    names: string[];
  };
};

export type ReportEvent =
  | FileDone
  | RunBegin
  | RunDone
  | TestError
  | TestFailure
  | TestSkip
  | TestSuccess;
