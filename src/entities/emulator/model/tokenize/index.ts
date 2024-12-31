import { Token, TokenType } from "./types";
import consumeWhile from "./consumeWhile";
import findMatchingKeyword from "./findMatchingKeyword";
import isDigit from "./isDigit";
import isWhitespace from "./isWhitespace";
import isOperator from "./isOperator";

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

    // Handle keywords
    const keyword = findMatchingKeyword(expression, i);
    if (keyword) {
      tokens.push({ type: TokenType.Keyword, value: keyword });
      i += keyword.length;
      continue;
    }

    // Handle operators
    if (isOperator(curChar)) {
      tokens.push({ type: TokenType.Operator, value: curChar });
      i++;
      continue;
    }

    // Handle literal numbers
    if (isDigit(curChar)) {
      const lastIndex = consumeWhile(
        expression,
        i,
        (char) => isDigit(char) || char === ".",
      );
      tokens.push({ type: TokenType.LiteralNumber, value: expression.slice(i, lastIndex) });
      i += lastIndex - i;
      continue;
    }

    // Handle comments
    if (curChar === "#") {
      const lastIndex = consumeWhile(expression, i, (char) => char !== "\n");
      i += lastIndex - i;
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
