import isWhitespace from "@/shared/lib/isWhitespace";
import { ValueOfMap } from "@/shared/lib/types";
import { TokenType, TokenWithType } from "./types";

const keywordToTokenType = new Map([
  ["P", TokenType.ActionCard],
  ["B", TokenType.ActionCard],
  ["H", TokenType.ActionCard],
  ["+", TokenType.OperationCard],
  ["-", TokenType.OperationCard],
  ["*", TokenType.OperationCard],
  ["/", TokenType.OperationCard],
] as const);

const keywords = Array.from(keywordToTokenType.keys());

export default function getKeyword(
  line: string,
  ln: number,
  col: number,
): TokenWithType<ValueOfMap<typeof keywordToTokenType>> | null {
  for (const keyword of keywords) {
    const idxAfterKeyword = col + keyword.length;

    if (
      line.slice(col, idxAfterKeyword) === keyword &&
      isWhitespace(line[idxAfterKeyword] || "\n")
    )
      // Magic for "typescript shut up"
      return {
        type: keywordToTokenType.get(keyword)!,
        lexeme: keyword,
        ln,
        col,
      } as TokenWithType<TokenType.Unknown>;
  }

  return null;
}
