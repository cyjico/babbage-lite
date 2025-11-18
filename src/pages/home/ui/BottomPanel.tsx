import { useInterpreterContext } from "@/entities/Interpreter";
import { Problem, ProblemSeverity } from "@/shared/model/types";
import TabbedPanel from "@/shared/ui/TabbedPanel";
import { useEditorContext } from "@/widgets/Editor";
import { createEffect, For } from "solid-js";

export default function BottomPanel() {
  const { interpreter, diagnostics } = useInterpreterContext();
  const { editorState } = useEditorContext();

  let printerContentRef!: HTMLParagraphElement;

  createEffect(() => {
    // re-run when content changes
    interpreter.printingApparatus();

    queueMicrotask(() => {
      const printer = printerContentRef.parentElement!;
      printer.scrollTo(0, printer.scrollHeight);
    });
  });

  return (
    <>
      <TabbedPanel
        class_labelContainer="grid grid-cols-2 justify-center"
        class_labelInactive="pl-2 select-none opacity-50 bg-myblack hover:bg-mygrey hover:opacity-100"
        class_labelActive="pl-2 select-none"
        tabs={[
          {
            label: `ATTENDANT'S EXAMINATION${diagnostics.problems().length > 0 ? ` (${diagnostics.problems().length})` : ""}`,
            class: "overflow-y-auto grow list-disc",
            content: (
              <For each={diagnostics.problems()}>
                {(problem) => (
                  <>{createProblemOutput(problem, editorState.lines)}</>
                )}
              </For>
            ),
          },
          {
            label: "PRINTER",
            class: "overflow-y-auto grow",
            content: (
              <>
                <div class="sticky shadow-lg top-0 bg-mydarkgrey grid grid-cols-2 select-none">
                  <button
                    class="hover:bg-mygrey"
                    on:pointerdown={() => interpreter.clearPrintingApparatus()}
                  >
                    Erase
                  </button>
                  <button
                    class="hover:bg-mygrey"
                    on:pointerdown={() =>
                      navigator.clipboard.writeText(
                        interpreter.printingApparatus(),
                      )
                    }
                  >
                    Copy to Clipboard
                  </button>
                </div>

                <p ref={printerContentRef} class="whitespace-pre-wrap">
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

function createProblemOutput(problem: Problem, lines: string[]) {
  const line = lines[problem.ln];

  switch (problem.severity) {
    case ProblemSeverity.Error:
      return (
        <div class="my-2">
          <p>
            <span class="text-red-400 font-bold">✕</span> {problem.message} (
            {problem.code}) [Ln {problem.ln + 1}, Col {problem.col + 1}]
          </p>
          <p class="ml-6 border-l-2 pl-4">
            {line.slice(0, problem.col)}
            <span class="border-b-2 border-red-400">
              {line.slice(problem.col, problem.colend)}
            </span>
            {line.slice(problem.colend)}
          </p>
        </div>
      );
    case ProblemSeverity.Warning:
      return (
        <div class="my-2">
          <p>
            <span class="text-orange-300 font-bold">⚠︎</span> {problem.message}{" "}
            ({problem.code}) [Ln {problem.ln + 1}, Col {problem.col + 1}]
          </p>
          <p class="ml-6 border-l-2 pl-4">
            {line.slice(0, problem.col)}
            <span class="border-b-2 border-orange-300">
              {line.slice(problem.col, problem.colend)}
            </span>
            {line.slice(problem.colend)}
          </p>
        </div>
      );
    case ProblemSeverity.Information:
      return (
        <div class="my-2">
          <p>
            <span class="text-blue-400 font-bold">ⓘ</span> {problem.message} (
            {problem.code}) [Ln {problem.ln + 1}, Col {problem.col + 1}]
          </p>
          <p class="ml-6 border-l-2 pl-4">
            {line.slice(0, problem.col)}
            <span class="border-b-2 border-blue-400">
              {line.slice(problem.col, problem.colend)}
            </span>
            {line.slice(problem.colend)}
          </p>
        </div>
      );
  }
}
