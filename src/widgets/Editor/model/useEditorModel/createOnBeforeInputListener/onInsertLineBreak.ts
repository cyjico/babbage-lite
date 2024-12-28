import getLineElement from "../getLineElement";

export default function onInsertLineBreak(
  sel: Selection,
  selRange: Range,
  ref_content: HTMLElement,
) {
  const endLine = getLineElement(selRange.endContainer);
  if (!endLine) throw new Error("No `.line` element was found");

  switch (sel.type) {
    case "Caret":
      selRange.setStart(
        breakLine(endLine, selRange.startOffset, selRange.endOffset),
        0,
      );
      break;
    case "Range":
      if (selRange.commonAncestorContainer === ref_content) {
        // When?
        // - Selection has multiple lines

        const startLine = getLineElement(selRange.startContainer);
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

/**
 * Sets the `textContent` of a `.line` element.
 *
 * Take note that setting textContent on a node ***removes all*** of the node's
 * children. It then replaces them with a single text node with the given string
 * value.
 *
 * Therefore, it is guaranteed that the ***element will always have a text
 * node*** and, if empty, a `<br />` element.
 */
function setLineContent(ref_line: HTMLElement, textContent = "") {
  ref_line.textContent = textContent;

  if (textContent.length === 0)
    ref_line.appendChild(document.createElement("br"));
}
