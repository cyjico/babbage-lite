import getNextSibling from "@/shared/lib/getNextSibling";
import getSelf from "@/shared/lib/getSelf";

/**
 * Creates an onKeyDown event handler.
 *
 * @param ref_content Function that points to the `content` element.
 */
export default function createOnKeyDown(ref_content: () => HTMLElement) {
  return function (ev: KeyboardEvent) {
    const sel = window.getSelection();
    if (!(sel && sel.anchorNode) || sel.type === "None") {
      return;
    }

    // rangeCount will usually be 1 because, normally, the user can only have 1 selection
    const selRange = sel.getRangeAt(0);

    switch (ev.key) {
      case "Enter":
        onEnterKeyDown(sel, selRange, ref_content());

        ev.preventDefault();
        break;
    }
  };
}

function onEnterKeyDown(
  sel: Selection,
  selRange: Range,
  ref_content: HTMLElement,
) {
  switch (sel.type) {
    case "Caret":
      selRange.setStart(createNewline(selRange, ref_content), 0);
      break;
    case "Range":
      {
        const endline = getSelf(selRange.endContainer);
        const endline_isEmpty =
          endline.textContent?.slice(selRange.endOffset).length === 0;

        // Remove selected text
        selRange.deleteContents();

        if (selRange.commonAncestorContainer === ref_content) {
          // selRange has multiple lines
          if (endline_isEmpty) {
            endline.appendChild(document.createElement("br"));
          }

          selRange.setStart(endline, 0);
        } else {
          // selRange has a single line
          selRange.setStart(createNewline(selRange, ref_content), 0);
        }

        // "collapses" the end selection to the start selection
        selRange.collapse(true);
      }
      break;
  }
}

function createNewline(selRange: Range, ref_content: HTMLElement) {
  const newline = document.createElement("div");
  newline.classList.add("line");
  setLine(
    newline,
    selRange.endContainer.textContent?.slice(selRange.endOffset) || "",
  );

  const curline = getSelf(selRange.endContainer);
  setLine(curline, curline.textContent?.slice(0, selRange.endOffset) || "");

  // Insert newline into the editor
  const nextSibling = getNextSibling(curline);
  if (nextSibling) {
    ref_content.insertBefore(newline, nextSibling);
  } else {
    ref_content.appendChild(newline);
  }

  return newline;
}

function setLine(line: Node, textContent: string) {
  line.textContent = textContent;

  if (textContent.length === 0) {
    line.appendChild(document.createElement("br"));
  }
}
