import isDigit from "./isDigit";

export default function findFloat(input: string, atStart: number) {
  let hasDecimalPoint = false;
  for (; atStart < input.length; atStart++) {
    if (input[atStart] === ".") {
      if (hasDecimalPoint) break;

      hasDecimalPoint = true;
      continue;
    }

    if (!isDigit(input[atStart])) break;
  }

  return atStart;
}
