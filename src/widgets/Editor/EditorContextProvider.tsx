import { Direction } from "@/shared/model/types";
import {
  Context,
  createContext,
  createMemo,
  ParentProps,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { EditorSelection, EditorState } from "./model/types";
import EditorHistory from "./model/EditorHistory";
import { useInterpreterContext } from "@/entities/Interpreter";

interface EditorContextProviderValue {
  editorState: EditorState;
  editorHistory: EditorHistory;
}

const EditorContext =
  createContext<EditorContextProviderValue>() as Context<EditorContextProviderValue>;

export function useEditorContext() {
  return useContext(EditorContext);
}

export default function EditorContextProvider(props: ParentProps) {
  const [sel, setSel] = createStore<EditorSelection>({
    lineIdxStart: 0,
    offsetStart: 0,
    lineIdxEnd: 0,
    offsetEnd: 0,
    direction: Direction.None,
    toString: () => "",
  });
  const [lines, setLines] = createStore<string[]>([""]);

  const editorState = { sel, setSel, lines, setLines };
  const editorHistory = new EditorHistory(editorState);

  {
    const { interpreter, diagnostics } = useInterpreterContext();
    diagnostics.problems = createMemo(() => interpreter.compile(lines));
  }

  return (
    <EditorContext.Provider
      value={{
        editorState,
        editorHistory,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
}
