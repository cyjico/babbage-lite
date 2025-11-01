import { Direction } from "@/shared/model/types";
import { produce } from "solid-js/store";
import { EditorState } from "../model";

export default function captureSelection(
  editorState: EditorState,
) {
  const rawSel = document.getSelection();

  if (!rawSel || rawSel.rangeCount === 0) {
    editorState._setSel("direction", Direction.None);
    return;
  }

  const range = rawSel.getRangeAt(0)!;
  if (
    !range.startContainer.parentElement!.classList.contains("line") &&
    (range.startContainer.nodeType !== Node.ELEMENT_NODE ||
      !(range.startContainer as HTMLElement).classList.contains("line"))
  )
    return;

  const direction: Direction =
    rawSel.direction === "forward"
      ? Direction.Forward
      : rawSel.direction === "backward"
        ? Direction.Backward
        : Direction.None;

  const lineIdxStart = parseFloat(
    (range.startContainer.nodeType === Node.TEXT_NODE ||
    (range.startContainer.nodeType === Node.ELEMENT_NODE &&
      !(range.startContainer as HTMLElement).classList.contains("line"))
      ? range.startContainer.parentElement!
      : (range.startContainer as HTMLDivElement)
    ).id,
  );
  const offsetStart = range.startOffset;
  const lineIdxEnd = parseFloat(
    (range.endContainer.nodeType === Node.TEXT_NODE ||
    (range.endContainer.nodeType === Node.ELEMENT_NODE &&
      !(range.endContainer as HTMLElement).classList.contains("line"))
      ? range.endContainer.parentElement!
      : (range.endContainer as HTMLDivElement)
    ).id,
  );
  const offsetEnd = range.endOffset;

  editorState._setSel(
    produce((state) => {
      state.direction = direction;
      state.lineIdxStart = lineIdxStart;
      state.offsetStart = offsetStart;
      state.lineIdxEnd = lineIdxEnd;
      state.offsetEnd = offsetEnd;
      state.toString = () => rawSel.toString();
    }),
  );
}
