import getLine from "./lib/getLine";
import setLineContent from "./lib/setLineContent";

export default function onInsertLineBreak(
  sel: Selection,
  selRange: Range,
  contentRef: HTMLElement,
) {
  const endLine = getLine(selRange.endContainer);
  if (!endLine) throw new Error("No `.line` element was found");

  switch (sel.type) {
    case "Caret":
      selRange.setStart(
        breakLine(endLine, selRange.startOffset, selRange.endOffset),
        0,
      );
      break;
    case "Range":
      if (selRange.commonAncestorContainer === contentRef) {
        // When?
        // - Selection has multiple lines

        const startLine = getLine(selRange.startContainer);
        if (!startLine) throw new Error("No `.line` element was found");

        selRange.deleteContents();

        if (startLine.parentElement && startLine.textContent!.length === 0)
          startLine.appendChild(document.createElement("br"));

        if (endLine.parentElement && endLine.textContent!.length === 0)
          endLine.appendChild(document.createElement("br"));

        selRange.setStart(endLine, 0);
      } else {
        // When?
        // - Selection has a single line

        selRange.setStart(
          breakLine(endLine, selRange.startOffset, selRange.endOffset),
          0,
        );
      }
      break;
  }

  selRange.collapse(true);
}

/**
 * *Breaks* a line into two. Anything between `start` and `end` (exclusive) will
 * be deleted.
 *
 * @returns Newline made from the function.
 */
function breakLine(line: HTMLElement, start: number, end: number) {
  if (start > end) {
    // Self-inverse property: a XOR a = 0
    start = start ^ end; // a XOR b
    end = start ^ end; // (a XOR b) XOR b = a
    start = start ^ end; // (a XOR b) XOR a = b
  }

  const newline = document.createElement("div");
  newline.classList.add("line");
  setLineContent(newline, line.textContent!.slice(end));
  line.insertAdjacentElement("afterend", newline);

  setLineContent(line, line.textContent!.slice(0, start));

  return newline;
}
