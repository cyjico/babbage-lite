import { Token, TokenType } from "./types";
export type { Token, TokenType };

import consumeWhile from "./consumeWhile";
import isDigit from "./isDigit";
import isWhitespace from "./isWhitespace";
import isOperator from "./isOperator";
import findKeyword from "./findKeyword";

export default function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expression.length) {
    const curChar = expression[i];

    // Handle whitespace
    if (isWhitespace(curChar)) {
      i++;
      continue;
    }

    // Handle keywords (number, action, combinatorial, variable)
    const keywordMatch = findKeyword(expression, i);
    if (keywordMatch) {
      tokens.push(keywordMatch);
      i += keywordMatch.value.length;
      continue;
    }

    // Handle operation cards
    if (isOperator(curChar)) {
      tokens.push({ type: TokenType.OperationCard, value: curChar });
      i++;
      continue;
    }

    // Handle numberic literals
    if (isDigit(curChar)) {
      const lastIndex = consumeWhile(
        expression,
        i,
        (char) => isDigit(char) || char === ".",
      );
      tokens.push({
        type: TokenType.NumericLiteral,
        value: expression.slice(i, lastIndex),
      });
      i += lastIndex - i;
      continue;
    }

    // Handle comments
    if (curChar === "#") {
      i = consumeWhile(expression, i, (char) => char !== "\n");
      continue;
    }

    // Handle unknown characters
    throw new Error(
      "Unrecognized character found in source:\n\n" +
        expression.slice(0, i) +
        `>>${expression[i]}<<` +
        expression.slice(i + 1),
    );
  }

  return tokens;
}
