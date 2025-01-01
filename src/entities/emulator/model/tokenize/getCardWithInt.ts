import { KeyOfMap } from "@/shared/lib/types";
import { Token, TokenType } from "./types";
import findInt from "./findInt";
import isWhitespace from "./isWhitespace";

const cardGroups = new Map([
  ["number", ["N"]],
  ["combinatorial", ["CF?", "CF!", "CB?", "CB!"]],
  ["variable", ["L", "S"]],
] as const);

const cardGroupToTokenType: Record<
  KeyOfMap<typeof cardGroups>,
  [TokenType, TokenType.NumericLiteral | TokenType.AddressLiteral]
> = {
  number: [TokenType.NumberCard, TokenType.AddressLiteral],
  combinatorial: [TokenType.CombinatorialCard, TokenType.NumericLiteral],
  variable: [TokenType.VariableCard, TokenType.AddressLiteral],
};

export default function getCardWithInt(input: string, atStart: number) {
  for (const [cardGroup, cards] of cardGroups) {
    for (const card of cards) {
      const idxAfterCard = atStart + card.length;

      if (input.slice(atStart, idxAfterCard) === card) {
        const output: [Token, Token?] = [
          {
            type: cardGroupToTokenType[cardGroup][0],
            value: card,
          },
        ];

        const idxAfterInt = findInt(input, idxAfterCard);
        if (
          idxAfterInt !== idxAfterCard &&
          isWhitespace(input[idxAfterInt] || "\n")
        )
          output.push({
            type: cardGroupToTokenType[cardGroup][1],
            value: input.slice(idxAfterCard, idxAfterInt),
          });

        return output;
      }
    }
  }

  return null;
}
