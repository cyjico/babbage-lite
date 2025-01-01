/**
 * Defines the types of tokens generated by `tokenize()`.
 *
 * - `<...>Card`: Captures the symbol (e.g. `CF?` in `CF?10`).
 * - `LiteralNumber`: Captures numeric values (e.g. `10` in `CF?10`).
 */
export enum TokenType {
  Unknown = "Unknown",
  // Number:
  // N<3-digit number> <number>
  NumberCard = "NumberCard",
  // Operation:
  // + - * x /
  OperationCard = "OperationCard",
  // Action:
  // P B H
  ActionCard = "ActionCard",
  // Combinatorial:
  // CF?<number> CB?<number>
  // CF!<number> CB!<number>
  CombinatorialCard = "CombinatorialCard",
  // Variable:
  // L<3-digit number> Z<3-digit number> S<3-digit number>
  VariableCard = "VariableCard",
  AddressLiteral = "AddressLiteral",
  CardinalLiteral = "CardinalLiteral",
  NumericLiteral = "NumericLiteral",
}

export interface Token {
  type: TokenType;
  value: string;
  row: number;
  col: number,
}
