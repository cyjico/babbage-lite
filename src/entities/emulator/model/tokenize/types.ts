export enum TokenType {
  Unknown = "Unknown",
  Keyword = "Keyword",
  // { CF?<number>, CB?<number>, P, B, H, N<3-digit number>, L<3-digit number>, S<3-digit number> }
  Operator = "Operator",
  // { +, -, /, *, x }
  LiteralNumber = "LiteralNumber",
}

export interface Token {
  value: string;
  type: TokenType;
}
