export enum ASTCardType {
  NumberCard = "NumberCard",
  OperationCard = "OperationCard",
  ActionCard = "ActionCard",
  CombinatorialCard = "CombinatorialCard",
  VariableCard = "VariableCard",
}

/**
 * Interface that represents _any_ card in the reader.
 */
export interface ASTCard {
  type: ASTCardType;
  ln: number;
  col: number;
  colend: number;
}

/**
 * Helper interface ONLY FOR internal use.
 */
interface ASTCard_<T extends ASTCardType> extends ASTCard {
  type: T;
}

export interface NumberCardNode extends ASTCard_<ASTCardType.NumberCard> {
  address: `${number}`;
  number: number;
}

export interface OperationCardNode extends ASTCard_<ASTCardType.OperationCard> {
  operation: "+" | "-" | "*" | "/";
}

export interface ActionCardNode extends ASTCard_<ASTCardType.ActionCard> {
  action: "P" | "B" | "H";
}

export interface CombinatorialCardNode
  extends ASTCard_<ASTCardType.CombinatorialCard> {
  direction: "F" | "B";
  condition: "+" | "?";
  skips: number;
}

export interface VariableCardNode extends ASTCard_<ASTCardType.VariableCard> {
  action: "L" | "S";
  address: `${number}`;
}
