import { createEffect, createSignal } from "solid-js";
import { useEditorContext } from "../Editor/ContextProvider";

export default function EditorStatusBar() {
  const { viewState } = useEditorContext();

  const [ln, setLn] = createSignal(1);
  const [col, setCol] = createSignal(1);
  const [selLength, setSelLength] = createSignal(0);

  createEffect(() => {
    const sel = viewState.sel();
    if (!sel) return;

    setLn(sel.focusLineIdx + 1);
    setCol(sel.focusLineOffset + 1);
    setSelLength(sel.endLineIdx - sel.startLineIdx + sel.asString.length);
  });

  return (
    <span>
      Ln {ln()}, Col {col()}
      {selLength() > 0 ? <> ({selLength()} selected)</> : ""}
    </span>
  );
}
