import createProblemOutput from "@/shared/lib/createProblemOutput";
import { ProblemSeverity } from "@/shared/model/types";
import TabbedPanel from "@/shared/ui/TabbedPanel";
import { useEditorContext } from "@/widgets/Editor";
import { createEffect, For } from "solid-js";

export default function BottomPanel() {
  const { interpreter, editorState, editorDebugger } = useEditorContext();

  let printerRef!: HTMLParagraphElement;

  createEffect(() => {
    // re-run when content changes
    interpreter.printingApparatus();

    queueMicrotask(() => {
      printerRef.scrollTop = printerRef.scrollHeight;
    });
  });

  return (
    <>
      <TabbedPanel
        class_labelContainer="grid grid-cols-2"
        class_labelInactive="opacity-50"
        class_labelActive=""
        tabs={[
          {
            label: `ATTENDANT'S EXAMINATION ${editorDebugger.problems().length > 0 ? ` (${editorDebugger.problems().length})` : ""}`,
            class: "overflow-y-auto grow list-disc",
            content: (
              <For each={editorDebugger.problems()} fallback={<li />}>
                {(v) => (
                  <li class="whitespace-pre-wrap">
                    {v.severity == ProblemSeverity.Error ? "❌ " : "⚠️ "}
                    {createProblemOutput(editorState.lines, v)}
                  </li>
                )}
              </For>
            ),
          },
          {
            label: "PRINTER",
            class: "overflow-y-auto grow",
            content: (
              <>
                <button on:click={() => interpreter.clearPrintingApparatus()}>
                  Erase
                </button>
                <button
                  on:click={() =>
                    navigator.clipboard.writeText(
                      interpreter.printingApparatus(),
                    )
                  }
                >
                  Copy to Clipboard
                </button>

                <p
                  ref={printerRef}
                  class="bg-[#0f0f0f] whitespace-pre-wrap min-h-full"
                >
                  {interpreter.printingApparatus()}
                </p>
              </>
            ),
          },
        ]}
      />
    </>
  );
}
