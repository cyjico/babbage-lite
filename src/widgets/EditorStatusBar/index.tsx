import { createEffect, createSignal } from "solid-js";
import { useEditorContext } from "../Editor/ContextProvider";

export default function EditorStatusBar() {
  const { selection } = useEditorContext();

  const [lastSelLn, setLastSelLn] = createSignal(0);
  const [lastSelCol, setLastSelCol] = createSignal(0);

  createEffect(() => {
    const sel = selection();
    if (!sel) return;

    setLastSelLn(sel.endLineIndex + 1);
    setLastSelCol(sel.endOffset + 1);
  });

  return (
    <span>
      Ln {lastSelLn()}, Col {lastSelCol()}
    </span>
  );
}
