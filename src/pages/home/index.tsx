import "./styles.css";
import Editor, {
  EditorContextProvider,
  useEditorContext,
} from "@/widgets/Editor";
import EditorStatusBar from "@/widgets/EditorStatusBar";
import ResizableVerticalPanel from "@/shared/ui/ResizableVerticalPanel";
import ResizableHorizontalPanel from "@/shared/ui/ResizableHorizontalPanel";
import ToolBar from "./ui/ToolBar";
import SidePanel from "./ui/SidePanel";
import BottomPanel from "./ui/BottomPanel";
import { createSignal, onCleanup, Show } from "solid-js";
import { LocalStorageEvent } from "@/shared/infra/localStorageSetItem";
import { InterpreterContextProvider } from "@/entities/Interpreter";

export default function HomePage() {
  return (
    <InterpreterContextProvider>
      <EditorContextProvider>
        <Workspace />
      </EditorContextProvider>
    </InterpreterContextProvider>
  );
}

function Workspace() {
  const { editorState } = useEditorContext();
  const [isShowingSavedNotif, setIsShowingSavedNotif] = createSignal(false);

  const savedFileContent = localStorage.getItem("savedFileContent");
  if (savedFileContent !== null)
    editorState.setLines(JSON.parse(savedFileContent) as string[]);

  function handler(evt: Event) {
    const customEvt = evt as LocalStorageEvent<unknown>;

    if (customEvt.detail.key === "savedFileContent") {
      setIsShowingSavedNotif(true);
      setTimeout(() => setIsShowingSavedNotif(false), 1000);
    }
  }

  window.addEventListener("localstoragechange", handler);
  onCleanup(() => window.removeEventListener("localstoragechange", handler));

  return (
    <>
      <Show when={isShowingSavedNotif()}>
        <div class="fixed top-12 left-4 bg-rebeccapurple px-4 py-2 shadow-2xl shadow-black z-50">
          File saved!
        </div>
      </Show>

      <header class="pt-3">
        <ToolBar />
      </header>
      <main class="flex flex-col bg-myblack">
        <Editor class="flex-1" />

        <ResizableVerticalPanel
          class="bg-mydarkgrey"
          class_interactable="bg-mygrey opacity-0 hover:opacity-50 transition-opacity"
        >
          <BottomPanel />
        </ResizableVerticalPanel>
      </main>
      <ResizableHorizontalPanel
        class="bg-mydarkgrey px-2 py-1"
        classInteractable="bg-mygrey opacity-0 hover:opacity-50 transition-opacity"
      >
        <SidePanel />
      </ResizableHorizontalPanel>
      <footer class="pb-3 px-2 bg-rebeccapurple">
        <EditorStatusBar />
      </footer>
    </>
  );
}
