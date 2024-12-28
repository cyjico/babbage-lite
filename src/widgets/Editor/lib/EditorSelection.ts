export default interface EditorSelection {
  startLine: HTMLElement;
  startLineIdx: number;
  startLineOffset: number;
  endLine: HTMLElement;
  endLineIdx: number;
  endLineOffset: number;
  focusLine: HTMLElement;
  focusLineIdx: number;
  focusLineOffset: number;
  forEach(fn: (line?: HTMLElement, idx?: number) => void): void;
  asString: string;
}
