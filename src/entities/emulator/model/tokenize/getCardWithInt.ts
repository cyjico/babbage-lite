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
  combinatorial: [TokenType.CombinatorialCard, TokenType.NumericLiteral],
  variable: [TokenType.VariableCard, TokenType.AddressLiteral],
};

export default function getCardWithInt(line: string, ln: number, col: number) {
  for (const [cardGroup, cards] of cardGroups) {
    for (const card of cards) {
      const idxAfterCard = col + card.length;

      if (line.slice(col, idxAfterCard) === card) {
        const output: [Token, Token?] = [
          {
            type: cardGroupToTokenType[cardGroup][0],
            lexeme: card as string,
            ln,
            col,
            colend: col + card.length,
          },
        ];

        const idxAfterInt = findInt(line, idxAfterCard);
        if (
          idxAfterInt !== idxAfterCard &&
          isWhitespace(line[idxAfterInt] || "\n")
        ) {
          const intLexeme = line.slice(idxAfterCard, idxAfterInt);
          output.push({
            type: cardGroupToTokenType[cardGroup][1] as TokenType,
            lexeme: intLexeme,
            ln,
            col: output[0].colend,
            colend: output[0].colend + intLexeme.length,
          });
        }

        return output;
      }
    }
  }

  return null;
}
