import isWhitespace from "@/shared/lib/isWhitespace";
import { ValueOfMap } from "@/shared/lib/types";
import { TokenType, TokenWithType } from "./types";
import { isDigit } from "./utils";

const keywordToTokenType = new Map([
  ["N", TokenType.NumberCard],
  ["L", TokenType.VariableCard],
  ["S", TokenType.VariableCard],
  ["CF?", TokenType.CombinatorialCard],
  ["CF+", TokenType.CombinatorialCard],
  ["CB?", TokenType.CombinatorialCard],
  ["CB+", TokenType.CombinatorialCard],
] as const);

const keywords = Array.from(keywordToTokenType.keys());

export default function getKeywordWithDigits(
  line: string,
  ln: number,
  col: number,
): TokenWithType<ValueOfMap<typeof keywordToTokenType>> | null {
  for (const keyword of keywords) {
    const idxAfterKeyword = col + keyword.length;

    if (line.slice(col, idxAfterKeyword) === keyword) {
      const type = keywordToTokenType.get(keyword)!;

      let idxAfterDigit;
      switch (type) {
        case TokenType.NumberCard:
        case TokenType.VariableCard:
          idxAfterDigit = findEndOfDigits(line, idxAfterKeyword, 3);
          break;
        case TokenType.CombinatorialCard:
          idxAfterDigit = findEndOfDigits(line, idxAfterKeyword);
          break;
      }

      if (
        !(
          idxAfterDigit !== idxAfterKeyword &&
          isWhitespace(line[idxAfterDigit] || "\n")
        )
      )
        return null;

      // Magic for "typescript shut up"
      return {
        type: type,
        lexeme: line.slice(col, idxAfterDigit),
        ln,
        col,
      } as TokenWithType<TokenType.Unknown>;
    }
  }

  return null;
}

function findEndOfDigits(
  input: string,
  start: number,
  maxLength = Number.POSITIVE_INFINITY,
) {
  let i = start;
  for (; i < input.length; i++) {
    if (!isDigit(input[i]) || i - start >= maxLength) break;
  }

  return i;
}
