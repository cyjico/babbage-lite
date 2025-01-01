import isDigit from "./isDigit";

export default function findInt(input: string, atStart: number) {
  for (; atStart < input.length; atStart++) {
    if (!isDigit(input[atStart])) break;
  }

  return atStart;
}
