import { TokenType, Token } from "./types";
import findFloat from "./findFloat";
import getCardWithInt from "./getCardWithInt";
import getCard from "./getCard";
import isWhitespace from "./isWhitespace";
import LexicalError from "@/shared/lib/LexicalError";

export default function tokenize(lines: string[]) {
  const tokens: Token[] = [];

  for (let row = 0; row < lines.length; row++) {
    const line = lines[row];

    let col = 0;
    while (col < line.length) {
      const curChar = line[col];

      // Handle whitespace
      if (isWhitespace(curChar)) {
        col++;
        continue;
      }

      // Handle cards (e.g. 'P')
      let match = null;
      if ((match = getCard(line, col))) {
        tokens.push(match);
        col += match.value.length;
        continue;
      }

      // Handle cards with an integer (e.g. `N012`)
      if ((match = getCardWithInt(line, col))) {
        if (!match[1])
          throw new LexicalError(
            row + 1,
            col + 1,
            "Expected an integer after " + `'${match[0].value}'`,
          );

        tokens.push(match[0], match[1]);
        col += match[0].value.length + match[1].value.length;
        continue;
      }

      // Handle numeric literals
      let afterEnd = null;
      if ((afterEnd = findFloat(line, col)) !== col) {
        tokens.push({
          type: TokenType.NumericLiteral,
          value: line.slice(col, afterEnd),
        });
        col += afterEnd - col;
        continue;
      }

      // Handle single-line comments
      if (curChar === "#") {
        col = line.length;
        continue;
      }

      // Handle unknown characters
      throw new LexicalError(
        row + 1,
        col + 1,
        `Unrecognized character found '${
          line[col]
        }' in '${line.slice(0, col)}' and '${line.slice(col + 1)}'`,
      );
    }
  }

  return tokens;
}

export { type Token, TokenType };
