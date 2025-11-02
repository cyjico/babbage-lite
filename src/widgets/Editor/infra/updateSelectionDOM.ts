import { EditorSelection } from "../model";

export default function updateSelectionDOM(
  content: HTMLDivElement,
  sel: Readonly<EditorSelection>,
) {
  const range = document.getSelection()!.getRangeAt(0);

  range.setStart(
    content.children.item(sel.lineIdxStart)!.firstChild!,
    sel.offsetStart,
  );
  range.setEnd(
    content.children.item(sel.lineIdxEnd)!.firstChild!,
    sel.offsetEnd,
  );
}
