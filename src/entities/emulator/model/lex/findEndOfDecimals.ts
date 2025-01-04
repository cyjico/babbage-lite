import { isDigit } from "./utils";

export default function findEndOfDecimals(input: string, start: number) {
  let hasDecimalPoint = false;
  for (; start < input.length; start++) {
    if (input[start] === ".") {
      if (hasDecimalPoint) break;

      hasDecimalPoint = true;
      continue;
    }

    if (!isDigit(input[start])) break;
  }

  return start;
}
