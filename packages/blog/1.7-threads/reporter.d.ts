type ReporterEvent = {
  type: string;
  names: string[];
  message?: string;
};

export type Reporter = (event: ReporterEvent) => void;
