import { Problem, ProblemSeverity } from "../model/types";

// #region (1xxx) lexical

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

// #region (2xxx) syntactic

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

export function multipleCardsOnTheSameLine(
  ln: number,
  col: number,
  colend: number,
): Problem {
  return {
    severity: ProblemSeverity.Error,
    code: 2004,
    ln,
    col,
    colend,
    // Technically, they are nodes of type node cards
    message: `Multiple cards on the same line.`,
  };
}

// #region (3xxx) semantic

export function undefinedAddress(
  address: number,
  ln: number,
  col: number,
  colend: number,
): Problem {
  return {
    severity: ProblemSeverity.Error,
    code: 3001,
    ln,
    col,
    colend,
    message: `Undefined address '${"0".repeat(
      3 - address.toString().length,
    )}${address}'.`,
  };
}

export function unusedAddress(
  address: number,
  ln: number,
  col: number,
  colend: number,
): Problem {
  return {
    severity: ProblemSeverity.Warning,
    code: 3002,
    message: `Address '${"0".repeat(
      3 - address.toString().length,
    )}${address}' is defined but never used.`,
    ln,
    col,
    colend,
  };
}

export function multipleDefinitions(
  address: number,
  ln: number,
  col: number,
  colend: number,
): Problem {
  return {
    severity: ProblemSeverity.Error,
    code: 3003,
    message: `Multiple definitions of store address '${"0".repeat(
      3 - address.toString().length,
    )}${address}'.`,
    ln,
    col,
    colend,
  };
}

export function operationOverrides(
  overriddenLn: number,
  ln: number,
  col: number,
  colend: number,
): Problem {
  return {
    severity: ProblemSeverity.Warning,
    code: 3004,
    message: `Operation oveerrides previous operation at line ${
      overriddenLn + 1
    }.`,
    ln,
    col,
    colend,
  };
}

export function noOperationSet(
  ln: number,
  col: number,
  colend: number,
): Problem {
  return {
    severity: ProblemSeverity.Error,
    code: 3005,
    message: `No operation set.`,
    ln,
    col,
    colend,
  };
}

export function noArithmeticOperationPerformedPrior(
  ln: number,
  col: number,
  colend: number,
): Problem {
  return {
    severity: ProblemSeverity.Error,
    code: 3006,
    message: `No arithmetic operation performed prior to usage of card.`,
    ln,
    col,
    colend,
  };
}

export function cardReaderMovementOutOfBounds(
  ln: number,
  col: number,
  colend: number,
): Problem {
  return {
    severity: ProblemSeverity.Error,
    code: 3007,
    message:
      "Attempt card reader movement is out of bounds. The chain does not contain enough cards to support the specified value",
    ln,
    col,
    colend,
  };
}
