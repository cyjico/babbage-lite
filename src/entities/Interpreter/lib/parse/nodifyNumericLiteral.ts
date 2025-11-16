import { Token, TokenType } from "../lex";
import { ASTNodeType, ASTNode_NumericLiteral } from "./types";

export default function nodifyNumericLiteral(
  token: Token | undefined,
): ASTNode_NumericLiteral | null {
  if (token?.type !== TokenType.NumericLiteral) return null;

  return {
    type: ASTNodeType.NumericLiteral,
    ln: token.ln,
    col: token.col,
    colend: token.col + token.lexeme.length,
    value: parseFloat(token.lexeme),
  };
}
