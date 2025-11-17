import { unrecognizedCharacters } from "@/shared/lib/problemTemplates";
import { Problem } from "@/shared/model/types";
import findEndOfDecimals from "./findEndOfDecimals";
import getKeyword from "./getKeyword";
import getKeywordWithDigits from "./getKeywordWithDigits";
import { Token, TokenType } from "./types";
import insertSorted from "@/shared/lib/insertSorted";
import problemSeverityComparator from "../problemSeverityComparator";
import { isWhitespace } from "./utils";

export default function lex(lines: readonly string[], problems: Problem[]) {
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

        insertSorted(
          problems,
          unrecognizedCharacters(ln, col, colend),
          problemSeverityComparator,
        );

        col = colend;
        continue;
      }
    }
  }

  return tokens;
}

export * from "./types";
