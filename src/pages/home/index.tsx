import "./styles.css";
import Editor, {
  EditorContextProvider,
  useEditorContext,
} from "@/widgets/Editor";
import TabbedPanel from "@/shared/ui/TabbedPanel";
import EditorStatusBar from "@/widgets/EditorStatusBar";
import { createEffect, For } from "solid-js";
import createProblemOutput from "@/shared/lib/createProblemOutput";
import ResizableVerticalPanel from "@/shared/ui/ResizableVerticalPanel";
import { ProblemSeverity } from "@/shared/model/types";
import ResizableHorizontalPanel from "@/shared/ui/ResizableHorizontalPanel";

export default function HomePage() {
  return (
    <EditorContextProvider>
      <header>
        <ToolBar />
      </header>

      <main class="flex flex-col bg-myblack">
        <Editor class="flex-1" />

        <ResizableVerticalPanel class_interactable="bg-mygrey opacity-0 hover:opacity-50 transition-opacity">
          <BottomPanel />
        </ResizableVerticalPanel>
      </main>

      <ResizableHorizontalPanel
        class="bg-myblack px-2 py-1"
        classInteractable="bg-mygrey opacity-0 hover:opacity-50 transition-opacity"
      >
        <SidePanel />
      </ResizableHorizontalPanel>

      <footer>
        <EditorStatusBar />
      </footer>
    </EditorContextProvider>
  );
}

function ToolBar() {
  const { interpreter } = useEditorContext();

  return (
    <>
      <div class="grid grid-flow-col grid-cols-5 place-items-center">
        <details class="relative">
          <summary>File</summary>
          <div class="absolute bg-mygrey z-10 p-2 whitespace-nowrap flex flex-col">
            <button>New File</button>
            <button>Open File</button>
            <button>Save File</button>
          </div>
        </details>

        <button
          class={!interpreter.isMounted() ? "visible" : "invisible"}
          disabled={interpreter.isMounted()}
          on:click={() => interpreter.mount()}
        >
          Mount
        </button>

        <div>
          <button
            class={
              interpreter.isMounted() && !interpreter.isAnimated()
                ? "visible"
                : "hidden"
            }
            disabled={interpreter.isAnimated()}
            on:click={() => interpreter.animate()}
          >
            Animate
          </button>
          <button
            class={interpreter.isAnimated() ? "visible" : "hidden"}
            disabled={!interpreter.isAnimated()}
            on:click={() => interpreter.pause()}
          >
            Pause
          </button>
        </div>

        <button
          class={
            !interpreter.isAnimated() && interpreter.isMounted()
              ? "visible"
              : "invisible"
          }
          disabled={interpreter.isAnimated() && interpreter.isMounted()}
          on:click={() => interpreter.step()}
        >
          Step
        </button>

        <button
          class={interpreter.isMounted() ? "visible" : "invisible"}
          disabled={!interpreter.isMounted()}
          on:click={() => interpreter.halt()}
        >
          Halt
        </button>
      </div>
    </>
  );
}

function SidePanel() {
  const { interpreter } = useEditorContext();

  return (
    <div class="flex flex-col h-full">
      <span>Operation: {interpreter.mill.operation}</span>
      <span>Run-up Lever: {interpreter.mill.runUpLever ? "Set" : "Unset"}</span>
      <span>Ingress Axis 1: {interpreter.mill.ingressAxis1}</span>
      <span>Ingress Axis 2: {interpreter.mill.ingressAxis2}</span>
      <span>Egress Axis: {interpreter.mill.egressAxis}</span>

      <hr />

      <h1>Store</h1>

      <div class="overflow-y-auto flex-1 h-fit">
        <table>
          <thead>
            <tr>
              <th scope="col">Address</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <For each={interpreter.store}>
              {(value, idx) => (
                <tr>
                  <td>{idx()}</td>
                  <td>{value}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BottomPanel() {
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
