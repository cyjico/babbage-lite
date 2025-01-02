import isDigit from "./isDigit";

export default function findInt(
  input: string,
  start: number,
  length = Number.POSITIVE_INFINITY,
) {
  let i = start;
  for (; i < input.length; i++) {
    if (!isDigit(input[i]) || i - start >= length) break;
  }

  return i;
}
