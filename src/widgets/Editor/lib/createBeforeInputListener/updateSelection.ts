import { EditorSelection } from ".";

export default function updateSelection(
  content: HTMLDivElement,
  sel: Readonly<EditorSelection>,
) {
  const range = document.getSelection()!.getRangeAt(0);

  range.setEnd(
    content.children.item(sel.lineIdxEnd)!.firstChild!,
    sel.offsetEnd,
  );
  range.setStart(
    content.children.item(sel.lineIdxStart)!.firstChild!,
    sel.offsetStart,
  );
}
