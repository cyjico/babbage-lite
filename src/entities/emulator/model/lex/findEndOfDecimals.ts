import { isDigit } from "./utils";

export default function findEndOfDecimals(input: string, start: number) {
  // a lone '-' will be lex'd as a keyword first before a numeric literal
  const hasNegativeSign = input[start] === "-";
  let hasDecimalPoint = false;

  let end = start + (hasNegativeSign ? 1 : 0);
  for (; end < input.length; end++) {
    if (hasNegativeSign && input[end] === "-") {
      break;
    }

    if (input[end] === ".") {
      if (hasDecimalPoint) break;

      hasDecimalPoint = true;
      continue;
    }

    if (!isDigit(input[end])) break;
  }

  if (
    // Only '-.' case
    (hasNegativeSign && hasDecimalPoint && start + 2 === end) ||
    // Only had '-' or '.'
    ((hasNegativeSign || hasDecimalPoint) && start + 1 === end)
  )
    return start;

  // '<number>.' or '-<number>.' case
  if (hasDecimalPoint && input[end - 1] === ".") return end - 1;

  return end;
}
