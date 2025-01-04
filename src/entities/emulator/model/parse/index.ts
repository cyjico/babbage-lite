import {
  expectedTokenAfterToken,
  multipleCardsOnTheSameLine,
  unexpectedToken,
} from "@/shared/lib/problemTemplates";
import { Problem } from "@/shared/model/types";
import { Token, TokenType } from "../lex";
import nodifyNumericLiteral from "./nodifyNumericLiteral";
import { ASTNode, ASTNodeType } from "./types";

export default function parse(tokens: Token[], out_problems: Problem[]) {
  const nodes: ASTNode[] = [];

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i++];

    switch (token.type) {
      case TokenType.NumberCard: {
        const node = nodifyNumericLiteral(tokens[i++]);
        if (!node) {
          out_problems.push(
            expectedTokenAfterToken(
              "Numeric Literal",
              "Number Card",
              token.ln,
              token.col,
              token.col + token.lexeme.length,
            ),
          );
          break;
        }

        nodes.push({
          type: ASTNodeType.NumberCard,
          ln: token.ln,
          col: token.col,
          address: parseInt(token.lexeme.slice(1)),
          number: node,
        });
        break;
      }
      case TokenType.OperationCard:
        nodes.push({
          type: ASTNodeType.OperationCard,
          operation: token.lexeme,
          ln: token.ln,
          col: token.col,
        });
        break;
      case TokenType.ActionCard:
        nodes.push({
          type: ASTNodeType.ActionCard,
          action: token.lexeme,
          ln: token.ln,
          col: token.col,
        });
        break;
      case TokenType.CombinatorialCard:
        nodes.push({
          type: ASTNodeType.CombinatorialCard,
          direction: token.lexeme[1] as "F" | "B",
          condition: token.lexeme[2] as "+" | "?",
          skips: parseInt(token.lexeme.slice(3), 10),
          ln: token.ln,
          col: token.col,
        });
        break;
      case TokenType.VariableCard:
        nodes.push({
          type: ASTNodeType.VariableCard,
          action: token.lexeme[0] as "L" | "S",
          address: parseInt(token.lexeme.slice(1)),
          ln: token.ln,
          col: token.col,
        });
        break;
      default:
        out_problems.push(
          unexpectedToken(token.ln, token.col, token.col + token.lexeme.length),
        );
        break;
    }

    // Check if the latest added node was in the same line as the previous one
    if (
      nodes.length >= 2 &&
      nodes[nodes.length - 1].ln === nodes[nodes.length - 2].ln
    ) {
      out_problems.push(
        multipleCardsOnTheSameLine(
          token.ln,
          token.col,
          token.col + token.lexeme.length,
        ),
      );

      nodes.pop();
    }
  }

  return nodes;
}

export * from "./types";
