export default class LexicalError extends Error {
  constructor(ln: number, col: number, message: string) {
    super(`${message} at line ${ln}, column ${col}`);
    this.name = "LexicalError";
  }
}
