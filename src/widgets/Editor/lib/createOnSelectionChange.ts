import { Setter } from "solid-js";
import { EditorSelection } from "..";

export default function createOnSelectionChange(
  setSelection: Setter<EditorSelection | undefined>,
) {
  return () => {
    const sel = window.getSelection();

    if (sel && sel.rangeCount > 0) {
      const selRange = sel.getRangeAt(0);

      setSelection({
        startContainer: selRange.startContainer,
        startOffset: selRange.startOffset,
        endContainer: selRange.endContainer,
        endOffset: selRange.endOffset,
      });
    }
  };
}
