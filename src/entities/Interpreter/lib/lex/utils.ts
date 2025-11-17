export function isDigit(char: string) {
  return char >= "0" && char <= "9";
}

export function isWhitespace(char: string): boolean {
  return (
    char === " " ||
    char === "\t" ||
    char === "\n" ||
    char === "\r" ||
    char === "\f"
  );
}
