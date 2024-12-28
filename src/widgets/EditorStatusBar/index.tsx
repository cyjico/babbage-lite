import { createEffect, createSignal } from "solid-js";
import { useEditorContext } from "../Editor/ContextProvider";

export default function EditorStatusBar() {
  const { selection } = useEditorContext();

  const [ln, setLn] = createSignal(1);
  const [col, setCol] = createSignal(1);

  createEffect(() => {
    const sel = selection();
    if (!sel) return;

    setLn(sel.focusLineIdx + 1);
    setCol(sel.focusLineOffset + 1);
  });

  return (
    <span>
      Ln {ln()}, Col {col()}
    </span>
  );
}
