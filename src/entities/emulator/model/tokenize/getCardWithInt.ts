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
  [TokenType, TokenType]
> = {
  number: [TokenType.NumberCard, TokenType.AddressLiteral],
  combinatorial: [TokenType.CombinatorialCard, TokenType.CardinalLiteral],
  variable: [TokenType.VariableCard, TokenType.AddressLiteral],
};

export default function getCardWithInt(line: string, col: number, row: number) {
  for (const [cardGroup, cards] of cardGroups) {
    for (const card of cards) {
      const idxAfterCard = col + card.length;

      if (line.slice(col, idxAfterCard) === card) {
        const output: [Token, Token?] = [
          {
            type: cardGroupToTokenType[cardGroup][0],
            value: card as string,
            row,
            col,
          },
        ];

        const idxAfterInt = findInt(line, idxAfterCard);
        if (
          idxAfterInt !== idxAfterCard &&
          isWhitespace(line[idxAfterInt] || "\n")
        )
          output.push({
            type: cardGroupToTokenType[cardGroup][1] as TokenType,
            value: line.slice(idxAfterCard, idxAfterInt),
            row,
            col,
          });

        return output;
      }
    }
  }

  return null;
}
