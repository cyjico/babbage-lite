import "./styles.css";
import Editor from "@/widgets/Editor";
import TabbedPanel from "@/shared/ui/TabbedPanel";
import EditorContextProvider, {
  useEditorContext,
} from "@/widgets/Editor/ContextProvider";
import EditorStatusBar from "@/widgets/EditorStatusBar";
import { For } from "solid-js";
import createProblemOutput from "@/shared/lib/createProblemOutput";
import ResizableVerticalPanel from "@/shared/ui/ResizableVerticalPanel";
import { ProblemSeverity } from "@/shared/model/types";

export default function HomePage() {
  return (
    <EditorContextProvider>
      <header>
        <div id="menubar">
          <button>File</button>
        </div>

        <div id="toolbar">
          <button>Run</button>
          <button>Continue/Pause</button>
          <button>Step</button>
          <button>Stop</button>
        </div>
      </header>

      <main>
        <Editor class="flex-1" />

        <DiagnosticsPanel />
      </main>

      <aside>
        <RuntimePanel />
      </aside>

      <footer>
        <EditorStatusBar />
      </footer>
    </EditorContextProvider>
  );
}

function RuntimePanel() {
  return (
    <>
      <section>
        <span>Operation: *</span>
        <span>Run-up Lever: Unset</span>
      </section>
      <section>
        <h1>Store</h1>

        <table>
          <thead>
            <tr>
              <th scope="col">Address</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>000</td>
              <td>10</td>
            </tr>
            <tr>
              <td>001</td>
              <td>5</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

function DiagnosticsPanel() {
  const { viewState, problems } = useEditorContext();

  return (
    <ResizableVerticalPanel classInteractable="bg-mydarkgrey hover:bg-mygrey transition-colors">
      <TabbedPanel
        classLabelContainer="grid grid-cols-2"
        classContentContainer="overflow-y-auto"
        tabs={[
          {
            label: `PROBLEMS ${problems().length > 0 ? ` (${problems().length})` : ""}`,
            content: (
              <ul class="list-disc">
                <For each={problems()} fallback={<li />}>
                  {(v) => (
                    <li class="whitespace-pre-wrap">
                      {v.severity == ProblemSeverity.Error ? "❌ " : "⚠️ "}
                      {createProblemOutput(viewState.lines(), v)}
                    </li>
                  )}
                </For>
              </ul>
            ),
          },
          {
            label: "OUTPUT",
            content: (
              <div>
                Incredible! However, if your energy in your pseudo-mind is not
                conducive - or yeah, I like the word conducive - to what I'm
                saying or what I'm feeling, then there's incompatibility. So how
                do you know that? How do you fix that? Well, first you have to
                understand. You have to look at yourself and say, what kind of
                energy or what kind of pseudo power do I have to set my
                atmosphere? Woooooah, That's good. What kind of pseudo-energy do
                I have that I can create?
              </div>
            ),
          },
        ]}
      />
    </ResizableVerticalPanel>
  );
}
