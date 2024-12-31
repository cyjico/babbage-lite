import isDigit from "./isDigit";
import isWhitespace from "./isWhitespace";

type t_keywords = "CF?" | "CB?" | "P" | "B" | "H" | "N" | "L" | "S";
const keywords: t_keywords[] = ["CF?", "CB?", "P", "B", "H", "N", "L", "S"];

export default function findMatchingKeyword(
  expression: string,
  index: number,
): t_keywords | null {
  for (const keyword of keywords) {
    if (expression.slice(index, index + keyword.length) === keyword) {
      const nextChar = expression[index + keyword.length];

      if (
        nextChar === undefined ||
        isWhitespace(nextChar) ||
        isDigit(nextChar)
      ) {
        return keyword;
      }
    }
  }

  return null;
}
