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
        class_labelContainer="grid grid-cols-2 justify-center"
        class_labelInactive="pl-2 opacity-50 bg-myblack hover:bg-mygrey hover:opacity-100"
        class_labelActive="pl-2"
        tabs={[
          {
            label: `ATTENDANT'S EXAMINATION${editorDebugger.problems().length > 0 ? ` (${editorDebugger.problems().length})` : ""}`,
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
                <div class="sticky shadow-lg top-0 bg-mydarkgrey grid grid-cols-2">
                  <button
                    class="hover:bg-mygrey"
                    on:click={() => interpreter.clearPrintingApparatus()}
                  >
                    Erase
                  </button>
                  <button
                    class="hover:bg-mygrey"
                    on:click={() =>
                      navigator.clipboard.writeText(
                        interpreter.printingApparatus(),
                      )
                    }
                  >
                    Copy to Clipboard
                  </button>
                </div>

                <p ref={printerRef} class="whitespace-pre-wrap">
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
