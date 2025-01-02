import { TokenType, Token, TokenWithType } from "./types";
import findFloat from "./findFloat";
import getCardWithInt from "./getCardWithInt";
import getCard from "./getCard";
import isWhitespace from "./isWhitespace";
import LexicalError from "@/shared/lib/LexicalError";

export default function tokenize(lines: string[]) {
  const tokens: Token[] = [];

  for (let ln = 0; ln < lines.length; ln++) {
    const line = lines[ln];

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
      if ((match = getCard(line, ln, col))) {
        tokens.push(match);
        col = match.colend;
        continue;
      }

      // Handle cards with an integer (e.g. `N012`)
      if ((match = getCardWithInt(line, ln, col))) {
        tokens.push(match);
        col = match.colend;
        continue;
      }

      // Handle numeric literals
      let afterEnd = null;
      if ((afterEnd = findFloat(line, col)) !== col) {
        tokens.push({
          type: TokenType.NumericLiteral,
          lexeme: line.slice(col, afterEnd),
          ln,
          col,
          colend: afterEnd,
        });
        col = afterEnd;
        continue;
      }

      // Handle single-line comments
      if (curChar === "#") {
        col = line.length;
        continue;
      }

      // Handle unknown characters
      throw LexicalError.unknownToken(lines, ln, col);
    }
  }

  return tokens;
}

export { TokenType, type Token, type TokenWithType as TokenOfType };
