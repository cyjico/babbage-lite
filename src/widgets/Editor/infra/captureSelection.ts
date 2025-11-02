import { Direction } from "@/shared/model/types";
import { produce } from "solid-js/store";
import { EditorState } from "../model";

export default function captureSelectionDOM(_setSel: EditorState["_setSel"]) {
  const selDOM = document.getSelection();

  if (!selDOM || selDOM.rangeCount === 0) {
    _setSel("direction", Direction.None);
    return;
  }

  const range = selDOM.getRangeAt(0)!;
  if (
    !range.startContainer.parentElement!.classList.contains("line") &&
    (range.startContainer.nodeType !== Node.ELEMENT_NODE ||
      !(range.startContainer as HTMLElement).classList.contains("line"))
  )
    return;

  const direction: Direction =
    selDOM.direction === "forward"
      ? Direction.Forward
      : selDOM.direction === "backward"
        ? Direction.Backward
        : Direction.None;

  const lineIdxStart = parseFloat(
    (range.startContainer.nodeType === Node.TEXT_NODE ||
    (range.startContainer.nodeType === Node.ELEMENT_NODE &&
      !(range.startContainer as HTMLElement).classList.contains("line"))
      ? range.startContainer.parentElement!
      : (range.startContainer as HTMLDivElement)
    ).dataset.id!,
  );
  const offsetStart = range.startOffset;
  const lineIdxEnd = parseFloat(
    (range.endContainer.nodeType === Node.TEXT_NODE ||
    (range.endContainer.nodeType === Node.ELEMENT_NODE &&
      !(range.endContainer as HTMLElement).classList.contains("line"))
      ? range.endContainer.parentElement!
      : (range.endContainer as HTMLDivElement)
    ).dataset.id!,
  );
  const offsetEnd = range.endOffset;

  _setSel(
    produce((state) => {
      state.direction = direction;
      state.lineIdxStart = lineIdxStart;
      state.offsetStart = offsetStart;
      state.lineIdxEnd = lineIdxEnd;
      state.offsetEnd = offsetEnd;
      state.toString = () => selDOM.toString();
    }),
  );
}
