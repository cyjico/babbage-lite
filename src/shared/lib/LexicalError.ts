export default class LexicalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LexicalError";
  }

  static unknownToken(lines: string[], ln: number, col: number) {
    const line = lines[ln];

    let tokenStart = col;
    while (tokenStart > 0 && line[tokenStart - 1] !== " ") tokenStart--;

    let tokenEnd = col;
    while (tokenEnd < line.length && line[tokenEnd] !== " ") tokenEnd++;

    return new LexicalError(
      `Unknown token '${line.slice(
        tokenStart,
        tokenEnd,
      )}' at line ${ln + 1}, column ${col + 1}`,
    );
  }
}
