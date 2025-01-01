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

export default function getCard(input: string, atStart: number): Token | null {
  for (const [cardGroup, cards] of cardGroups) {
    for (const card of cards) {
      const idxAfterCard = atStart + card.length;

      if (
        input.slice(atStart, idxAfterCard) === card &&
        isWhitespace(input[idxAfterCard] || "\n")
      )
        return {
          type: cardGroupToTokenType[cardGroup],
          value: card,
        };
    }
  }

  return null;
}
