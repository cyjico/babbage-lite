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

export interface ASTNode_NumberCard extends ASTNode_<ASTNodeType.NumberCard> {
  address: number;
  number: ASTNode_NumericLiteral;
}

export interface ASTNode_OperationCard
  extends ASTNode_<ASTNodeType.OperationCard> {
  operation: "+" | "-" | "*" | "/";
}

export interface ASTNode_ActionCard extends ASTNode_<ASTNodeType.ActionCard> {
  action: "P" | "B" | "H";
}

export interface ASTNode_CombinatorialCard
  extends ASTNode_<ASTNodeType.CombinatorialCard> {
  direction: "F" | "B";
  condition: "+" | "?";
  skips: number;
}

export interface ASTNode_VariableCard
  extends ASTNode_<ASTNodeType.VariableCard> {
  action: "L" | "S";
  address: number;
}

export interface ASTNode_NumericLiteral
  extends ASTNode_<ASTNodeType.NumericLiteral> {
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

/**
 * Discriminated union of all abstract-syntax tree nodes.
 */
export type ASTNode = ASTNode_Card | ASTNode_NumericLiteral;
