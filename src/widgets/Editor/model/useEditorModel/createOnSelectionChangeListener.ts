import { Setter } from "solid-js";
import EditorSelection from "../../lib/EditorSelection";
import getLineElement from "./getLineElement";

export default function createOnSelectionChange(
  lineElementToIdx: Map<HTMLElement, number>,
  setSelection: Setter<EditorSelection | undefined>,
) {
  return () => {
    const sel = window.getSelection();

    if (sel && sel.rangeCount > 0) {
      const selRange = sel.getRangeAt(0);
      const startLine = getLineElement(selRange.startContainer);
      const endLine = getLineElement(selRange.endContainer);

      if (
        startLine &&
        isInsideEditor(startLine) &&
        endLine &&
        isInsideEditor(endLine)
      ) {
        const focusLine = getLineElement(sel.focusNode!)!;

        setSelection({
          startLine,
          startLineIdx: lineElementToIdx.get(startLine)!,
          startLineOffset: selRange.startOffset,
          endLine,
          endLineIdx: lineElementToIdx.get(endLine)!,
          endLineOffset: selRange.endOffset,
          focusLine,
          focusLineIdx: lineElementToIdx.get(focusLine)!,
          focusLineOffset: sel.focusOffset,
        });
        return;
      }
    }

    setSelection(undefined);
  };
}

function isInsideEditor(node: Node) {
  let parent = node.parentElement;
  while (parent) {
    if (parent.classList.contains("editor")) return true;

    parent = parent.parentElement;
  }

  return false;
}
