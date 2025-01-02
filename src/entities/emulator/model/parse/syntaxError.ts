import { Token, TokenType } from "../tokenize";
import { ASTCard } from "./types";

const syntaxError = {
  unexpectedToken(token: Token) {
    return new SyntaxError(
      `Unexpected ${token.type
        .replace(/([A-Z]+)/g, " $1")
        .trim()
        .toLowerCase()} "${
        token.lexeme
      }" at line ${token.ln + 1}, column ${token.col + 1}`,
    );
  },
  expectedTokens(token: Token, expectedTokens: TokenType[]) {
    return new SyntaxError(
      `Expected tokens ${expectedTokens
        .map((v) => `'${v}'`)
        .join(" & ")} after token '${
        token.type
      }' at line ${token.ln + 1}, column ${token.col + 1}`,
    );
  },
  expectedEolButFoundCard(card: ASTCard) {
    return new SyntaxError(
      `Expected end-of-line but found a card of type '${
        card.type
      }' at line ${card.ln + 1}, column ${card.col + 1}`,
    );
  },
};

export default syntaxError;
