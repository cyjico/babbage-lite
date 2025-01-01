export default class LexicalError extends Error {
  constructor(row: number, column: number, message: string) {
    super(`${message} at line ${row}, column ${column}`);
    this.name = "LexicalError";
  }
}
