import isWhitespace from "@/shared/lib/isWhitespace";
import { unrecognizedCharacters } from "@/shared/lib/problemTemplates";
import { Problem } from "@/shared/model/types";
import findEndOfDecimals from "./findEndOfDecimals";
import getKeyword from "./getKeyword";
import getKeywordWithDigits from "./getKeywordWithDigits";
import { Token, TokenType } from "./types";

export default function lex(lines: string[], out_problems: Problem[]) {
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

      // Handle comments
      if (curChar === "#") {
        col = line.length;
        continue;
      }

      {
        // Handle keywords (e.g. 'P')
        const keyword = getKeyword(line, ln, col);
        if (keyword) {
          tokens.push(keyword);

          col += keyword.lexeme.length;
          continue;
        }
      }

      {
        // Handle keywords with a digit (e.g. `N012`)
        const keyword = getKeywordWithDigits(line, ln, col);
        if (keyword) {
          tokens.push(keyword);

          col += keyword.lexeme.length;
          continue;
        }
      }

      {
        // Handle numeric literals
        const end = findEndOfDecimals(line, col);
        if (end !== col) {
          tokens.push({
            type: TokenType.NumericLiteral,
            lexeme: line.slice(col, end) as `${number}`,
            ln,
            col,
          });

          col = end;
          continue;
        }
      }

      {
        // Handle unrecognized characters
        let colend = col;
        while (!isWhitespace(lines[ln][colend] || " ")) colend++;

        out_problems.push(unrecognizedCharacters(ln, col, colend));

        col = colend;
        continue;
      }
    }
  }

  return tokens;
}

export * from "./types";
