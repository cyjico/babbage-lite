import { createEffect, createSignal } from "solid-js";
import { useEditorContext } from "../Editor/ContextProvider";

export default function EditorStatusBar() {
  const { editorState } = useEditorContext();

  const [ln, setLn] = createSignal(1);
  const [col, setCol] = createSignal(1);
  const [selLength, setSelLength] = createSignal(0);

  createEffect(() => {
    const sel = editorState.sel;
    if (!sel) return;

    setLn(sel.lineIdxEnd + 1);
    setCol(sel.offsetEnd + 1);
    setSelLength(sel.toString().length);
  });

  return (
    <span>
      Ln {ln()}, Col {col()}
      {selLength() > 0 ? <> ({selLength()} selected)</> : ""}
    </span>
  );
}
