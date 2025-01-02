import { Token, TokenType } from "../tokenize";
import syntaxError from "./syntaxError";

export default function findTokensOfTypes(
  tokens: Token[],
  start: number,
  types: [TokenType, TokenType],
): [Token, Token];

export default function findTokensOfTypes(
  tokens: Token[],
  start: number,
  types: [TokenType],
): [Token];

export default function findTokensOfTypes(
  tokens: Token[],
  start: number,
  types: [],
): [];
export default function findTokensOfTypes(
  tokens: Token[],
  start: number,
  types: TokenType[],
): Token[];

export default function findTokensOfTypes(
  tokens: Token[],
  start: number,
  types: TokenType[],
): Token[] {
  const result = [];
  for (let i = 0; i < types.length; i++) {
    const token = tokens[start + i];
    if (!token || token.type !== types[i]) {
      throw syntaxError.expectedTokens(tokens[start - 1], types);
    }

    result.push(token);
  }

  return result;
}
