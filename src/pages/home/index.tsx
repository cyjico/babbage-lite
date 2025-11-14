import "./styles.css";
import Editor, { EditorContextProvider } from "@/widgets/Editor";
import EditorStatusBar from "@/widgets/EditorStatusBar";
import ResizableVerticalPanel from "@/shared/ui/ResizableVerticalPanel";
import ResizableHorizontalPanel from "@/shared/ui/ResizableHorizontalPanel";
import ToolBar from "./ui/ToolBar";
import SidePanel from "./ui/SidePanel";
import BottomPanel from "./ui/BottomPanel";

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
