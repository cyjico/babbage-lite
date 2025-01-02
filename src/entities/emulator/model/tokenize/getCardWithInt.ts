import { KeyOfMap, valueof } from "@/shared/lib/types";
import { TokenType, TokenWithType } from "./types";
import findInt from "./findInt";
import isWhitespace from "./isWhitespace";

const cardGroups = new Map([
  ["number", ["N"]],
  ["combinatorial", ["CF?", "CF!", "CB?", "CB!"]],
  ["variable", ["L", "S"]],
] as const);

const cardGroupToTokenType: Record<KeyOfMap<typeof cardGroups>, TokenType> = {
  number: TokenType.NumberCard,
  combinatorial: TokenType.CombinatorialCard,
  variable: TokenType.VariableCard,
};

export default function getCardWithInt(
  line: string,
  ln: number,
  col: number,
): TokenWithType<valueof<typeof cardGroupToTokenType>> | null {
  for (const [cardGroup, cards] of cardGroups) {
    for (const card of cards) {
      const idxAfterCard = col + card.length;

      if (line.slice(col, idxAfterCard) === card) {
        let idxAfterInt;
        switch (cardGroup) {
          case "number":
          case "variable":
            idxAfterInt = findInt(line, idxAfterCard, 3);
            break;
          case "combinatorial":
            idxAfterInt = findInt(line, idxAfterCard);
            break;
        }

        if (
          idxAfterInt === idxAfterCard ||
          !isWhitespace(line[idxAfterInt] || "\n")
        ) {
          return null;
        }

        return {
          type: cardGroupToTokenType[cardGroup],
          lexeme: line.slice(col, idxAfterInt),
          ln,
          col,
          colend: idxAfterInt,
        };
      }
    }
  }

  return null;
}
