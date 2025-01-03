import { KeyOfMap, valueof } from "@/shared/lib/types";
import { TokenType, TokenWithType } from "./types";
import isDigit from "./isDigit";
import isWhitespace from "./isWhitespace";

const cardGroups = new Map([
  ["number", ["N"]],
  ["combinatorial", ["CF?", "CF+", "CB?", "CB+"]],
  ["variable", ["L", "S"]],
] as const);

const cardGroupToTokenType: Record<KeyOfMap<typeof cardGroups>, TokenType> = {
  number: TokenType.NumberCard,
  combinatorial: TokenType.CombinatorialCard,
  variable: TokenType.VariableCard,
};

export default function getCardWithDigits(
  line: string,
  ln: number,
  col: number,
): TokenWithType<valueof<typeof cardGroupToTokenType>> | null {
  for (const [cardGroup, cards] of cardGroups) {
    for (const card of cards) {
      const idxAfterCard = col + card.length;

      if (line.slice(col, idxAfterCard) === card) {
        let idxAfterDigit;
        switch (cardGroup) {
          case "number":
          case "variable":
            idxAfterDigit = findDigits(line, idxAfterCard, 3);
            break;
          case "combinatorial":
            idxAfterDigit = findDigits(line, idxAfterCard);
            break;
        }

        if (
          !(
            idxAfterDigit !== idxAfterCard &&
            isWhitespace(line[idxAfterDigit] || "\n")
          )
        )
          return null;

        return {
          type: cardGroupToTokenType[cardGroup],
          lexeme: line.slice(col, idxAfterDigit),
          ln,
          col,
          colend: idxAfterDigit,
        };
      }
    }
  }

  return null;
}

function findDigits(
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
