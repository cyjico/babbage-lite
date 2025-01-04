import { Problem, ProblemSeverity } from "../model/types";

export function unrecognizedCharacters(
  ln: number,
  col: number,
  colend: number,
): Problem {
  return {
    severity: ProblemSeverity.Error,
    code: 1001,
    message: `Unrecognized character(s).`,
    ln,
    col,
    colend,
  };
}

export function unexpectedToken(
  ln: number,
  col: number,
  colend: number,
): Problem {
  return {
    severity: ProblemSeverity.Error,
    code: 2001,
    message: `Unexpected token.`,
    ln,
    col,
    colend,
  };
}

export function expectedTokenAfterToken(
  expected: string,
  beforeExpected: string,
  ln: number,
  col: number,
  colend: number,
): Problem {
  return {
    severity: ProblemSeverity.Error,
    code: 2003,
    message: `Expected token '${expected}' after '${beforeExpected}'.`,
    ln,
    col,
    colend,
  };
}