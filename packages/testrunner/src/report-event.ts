export type FileDone = {
  scope: "file";
  type: "done";
  data: {
    deps?: string[];
  };
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

export type TestSucceess = {
  scope: "test";
  type: "success";
  data: {
    names: string[];
  };
};

export type ReportEvent =
  | FileDone
  | TestError
  | TestFailure
  | TestSkip
  | TestSucceess;
