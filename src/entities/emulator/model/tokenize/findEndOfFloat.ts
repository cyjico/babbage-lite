import isDigit from "./isDigit";

export default function findEndOfFloat(input: string, start: number) {
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
