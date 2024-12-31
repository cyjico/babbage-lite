import { KeyOfMap } from "@/shared/lib/types";
import { Token, TokenType } from "./types";
import isDigit from "./isDigit";
import isWhitespace from "./isWhitespace";

const cardKeywords = new Map([
  ["number", ["N"]],
  ["action", ["P", "B", "H"]],
  ["combinatorial", ["CF?", "CF!", "CB?", "CB!"]],
  ["variable", ["L", "Z", "S"]],
] as const);

const cardKeywordsKeyToTokenType: Record<
  KeyOfMap<typeof cardKeywords>,
  TokenType
> = {
  number: TokenType.NumberCard,
  action: TokenType.ActionCard,
  combinatorial: TokenType.CombinatorialCard,
  variable: TokenType.VariableCard,
};

export default function findKeyword(source: string, start: number): Token | null {
  for (const [card, keywords] of cardKeywords) {
    for (const keyword of keywords) {
      if (source.slice(start, start + keyword.length) === keyword) {
        const nextChar = source[start + keyword.length];

        if (
          nextChar === undefined ||
          isWhitespace(nextChar) ||
          isDigit(nextChar)
        ) {
          return {
            type: cardKeywordsKeyToTokenType[card],
            value: keyword,
          };
        }
      }
    }
  }

  return null;
}
