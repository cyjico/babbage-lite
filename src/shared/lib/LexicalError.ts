export default class LexicalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LexicalError";
  }

  static unexpectedCharacter(lines: string[], ln: number, col: number) {
    return new LexicalError(
      `Unrecognized character '${
        lines[ln][col]
      }' found at line ${ln + 1}, column ${col + 1}\n\n` +
        `${lines[ln]}\n` +
        `${lines[ln].slice(0, col).replace(/./g, " ")}^`,
    );
  }
}
