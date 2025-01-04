import { Token, TokenType } from "../lex";
import { ASTNodeType, NumericLiteralNode } from "./types";

export default function nodifyNumericLiteral(
  token: Token,
): NumericLiteralNode | null {
  if (token.type !== TokenType.NumericLiteral) return null;

  return {
    type: ASTNodeType.NumericLiteral,
    ln: token.ln,
    col: token.col,
    value: parseFloat(token.lexeme),
  };
}
