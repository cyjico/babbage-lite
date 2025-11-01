export const enum ProblemSeverity {
  Information,
  Warning,
  Error,
}

export interface Problem {
  severity: ProblemSeverity;
  code: number;
  message: string;
  ln: number;
  col: number;
  colend: number;
}

export const enum Direction {
  Forward,
  Backward,
  None,
}
