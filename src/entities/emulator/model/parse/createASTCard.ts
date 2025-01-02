import { TokenType, Token, TokenOfType } from "../tokenize";
import syntaxError from "./syntaxError";
import {
  ActionCardNode,
  ASTCard,
  ASTCardType,
  CombinatorialCardNode,
  NumberCardNode,
  OperationCardNode,
  VariableCardNode,
} from "./types";

export default function createASTCard(
  token: TokenOfType<TokenType.NumberCard>,
  tokensNeeded: [TokenOfType<TokenType.NumericLiteral>],
): NumberCardNode;

export default function createASTCard(
  token: TokenOfType<TokenType.OperationCard>,
  tokensNeeded: [],
): OperationCardNode;

export default function createASTCard(
  token: TokenOfType<TokenType.ActionCard>,
  tokensNeeded: [],
): ActionCardNode;

export default function createASTCard(
  token: TokenOfType<TokenType.CombinatorialCard>,
  tokensNeeded: [],
): CombinatorialCardNode;

export default function createASTCard(
  token: TokenOfType<TokenType.VariableCard>,
  tokensNeeded: [],
): VariableCardNode;

export default function createASTCard(
  token: Token,
  tokensNeeded: Token[],
): ASTCard;
export default function createASTCard(
  token: Token,
  tokensNeeded: Token[],
): ASTCard {
  switch (token.type) {
    case TokenType.NumberCard: {
      const numericToken =
        tokensNeeded[0] as TokenOfType<TokenType.NumericLiteral>;

      return {
        type: ASTCardType.NumberCard,
        address: token.lexeme.slice(1),
        number: parseFloat(numericToken.lexeme),
        ln: token.ln,
        col: token.col,
        colend: numericToken.colend,
      } as NumberCardNode;
    }
    case TokenType.OperationCard:
      return {
        type: ASTCardType.OperationCard,
        operation: token.lexeme,
        ln: token.ln,
        col: token.col,
        colend: token.colend,
      } as OperationCardNode;
    case TokenType.ActionCard: {
      return {
        type: ASTCardType.ActionCard,
        action: token.lexeme,
        ln: token.ln,
        col: token.col,
        colend: token.colend,
      } as ActionCardNode;
    }
    case TokenType.CombinatorialCard: {
      return {
        type: ASTCardType.CombinatorialCard,
        direction: token.lexeme[1],
        condition: token.lexeme[2],
        skips: parseInt(token.lexeme.slice(3), 10),
        ln: token.ln,
        col: token.col,
        colend: token.colend,
      } as CombinatorialCardNode;
    }
    case TokenType.VariableCard: {
      return {
        type: "VariableCard",
        action: token.lexeme[0],
        address: token.lexeme.slice(1),
        ln: token.ln,
        col: token.col,
        colend: token.colend,
      } as VariableCardNode;
    }
    default:
      throw syntaxError.unexpectedToken(token);
  }
}
