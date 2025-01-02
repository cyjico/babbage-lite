import { KeyOfMap } from "@/shared/lib/types";
import { Token, TokenType } from "./types";
import isWhitespace from "./isWhitespace";

const cardGroups = new Map([
  ["action", ["P", "B", "H"]],
  ["operation", ["+", "-", "*", "x", "/"]],
] as const);

const cardGroupToTokenType: Record<KeyOfMap<typeof cardGroups>, TokenType> = {
  action: TokenType.ActionCard,
  operation: TokenType.OperationCard,
};

export default function getCard(
  line: string,
  ln: number,
  col: number,
): Token | null {
  for (const [cardGroup, cards] of cardGroups) {
    for (const card of cards) {
      const idxAfterCard = col + card.length;

      if (
        line.slice(col, idxAfterCard) === card &&
        isWhitespace(line[idxAfterCard] || "\n")
      )
        return {
          type: cardGroupToTokenType[cardGroup],
          lexeme: card,
          ln,
          col,
          colend: col + card.length,
        };
    }
  }

  return null;
}
