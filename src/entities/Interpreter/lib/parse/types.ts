export const enum ASTNodeType {
  NumberCard,
  OperationCard,
  ActionCard,
  CombinatorialCard,
  VariableCard,
  NumericLiteral,
}

interface ASTNode<T extends ASTNodeType> {
  type: T;
  ln: number;
  col: number;
  colend: number;
}

export interface ASTNode_NumberCard extends ASTNode<ASTNodeType.NumberCard> {
  address: number;
  number: ASTNode_NumericLiteral;
}

export interface ASTNode_OperationCard
  extends ASTNode<ASTNodeType.OperationCard> {
  operation: "+" | "-" | "*" | "/" | "%";
}

export interface ASTNode_ActionCard extends ASTNode<ASTNodeType.ActionCard> {
  action: "P" | "B" | "H";
}

export interface ASTNode_CombinatorialCard
  extends ASTNode<ASTNodeType.CombinatorialCard> {
  direction: "F" | "B";
  condition: "+" | "?";
  skips: number;
}

export interface ASTNode_VariableCard
  extends ASTNode<ASTNodeType.VariableCard> {
  action: "L" | "S";
  address: number;
}

export interface ASTNode_NumericLiteral
  extends ASTNode<ASTNodeType.NumericLiteral> {
  value: number;
}

/**
 * Discriminated union of ONLY abstract-syntax tree nodes that are cards.
 */
export type ASTNode_Card =
  | ASTNode_NumberCard
  | ASTNode_OperationCard
  | ASTNode_ActionCard
  | ASTNode_CombinatorialCard
  | ASTNode_VariableCard;
