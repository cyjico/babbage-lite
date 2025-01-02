import { Token, TokenType } from "../tokenize";
import { ASTCard } from "./types";
import createASTCard from "./createASTCard";
import syntaxError from "./syntaxError";
import findTokensOfTypes from "./findTokensOfTypes";

const tokensNeededAfterToken = new Map<TokenType, [] | [TokenType]>([
  [TokenType.NumberCard, [TokenType.NumericLiteral]],
  [TokenType.OperationCard, []],
  [TokenType.ActionCard, []],
  [TokenType.CombinatorialCard, []],
  [TokenType.VariableCard, []],
] as const);

export default function parse(tokens: Token[]) {
  const reader: ASTCard[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (!tokensNeededAfterToken.has(token.type))
      throw syntaxError.unexpectedToken(token);

    const tokensNeeded = tokensNeededAfterToken.get(token.type);
    if (!tokensNeeded) throw syntaxError.unexpectedToken(token);

    const neededTokensFound = findTokensOfTypes(tokens, i + 1, tokensNeeded);
    if (!neededTokensFound)
      throw syntaxError.expectedTokens(token, tokensNeeded);

    const astNode = createASTCard(token, neededTokensFound);
    if (
      reader[reader.length - 1] &&
      reader[reader.length - 1].ln === astNode.ln
    )
      throw syntaxError.expectedEolButFoundCard(astNode);

    reader.push(astNode);

    i += neededTokensFound.length;
  }

  return reader;
}
