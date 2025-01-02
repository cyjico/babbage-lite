import getLineElement from "../getLineElement";
import setLineElementContent from "../setLineElementContent";

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
        breakLineElement(endLine, selRange.startOffset, selRange.endOffset),
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
          breakLineElement(endLine, selRange.startOffset, selRange.endOffset),
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
function breakLineElement(
  ref_lineElement: HTMLElement,
  start: number,
  end: number,
) {
  if (start > end) {
    // Self-inverse property: a XOR a = 0
    start = start ^ end; // a XOR b
    end = start ^ end; // (a XOR b) XOR b = a
    start = start ^ end; // (a XOR b) XOR a = b
  }

  const newline = document.createElement("div");
  newline.classList.add("line");
  setLineElementContent(newline, ref_lineElement.textContent!.slice(end));
  ref_lineElement.insertAdjacentElement("afterend", newline);

  setLineElementContent(
    ref_lineElement,
    ref_lineElement.textContent!.slice(0, start),
  );

  return newline;
}
