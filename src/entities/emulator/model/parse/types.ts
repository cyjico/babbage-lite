export const enum ASTNodeType {
  NumberCard,
  OperationCard,
  ActionCard,
  CombinatorialCard,
  VariableCard,
  NumericLiteral,
}

/**
 * Helper for a ASTNode
 */
interface ASTNode_<T extends ASTNodeType> {
  type: T;
  ln: number;
  col: number;
}

export interface NumberCardNode extends ASTNode_<ASTNodeType.NumberCard> {
  address: number;
  number: NumericLiteralNode;
}

export interface OperationCardNode extends ASTNode_<ASTNodeType.OperationCard> {
  operation: "+" | "-" | "*" | "/";
}

export interface ActionCardNode extends ASTNode_<ASTNodeType.ActionCard> {
  action: "P" | "B" | "H";
}

export interface CombinatorialCardNode
  extends ASTNode_<ASTNodeType.CombinatorialCard> {
  direction: "F" | "B";
  condition: "+" | "?";
  skips: number;
}

export interface VariableCardNode extends ASTNode_<ASTNodeType.VariableCard> {
  action: "L" | "S";
  address: number;
}

export interface NumericLiteralNode
  extends ASTNode_<ASTNodeType.NumericLiteral> {
  value: number;
}

/**
 * Discriminated union of all abstract-syntax tree nodes.
 */
export type ASTNode =
  | NumberCardNode
  | OperationCardNode
  | ActionCardNode
  | CombinatorialCardNode
  | VariableCardNode
  | NumericLiteralNode;
