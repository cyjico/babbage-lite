import { Direction } from "@/shared/model/types";
import {
  Context,
  createContext,
  createMemo,
  createSignal,
  ParentProps,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { EditorContextProviderValue, EditorSelection } from "./model/types";
import EditorHistory from "./model/EditorHistory";
import Interpreter from "@/entities/Interpreter";

const EditorContext =
  createContext<EditorContextProviderValue>() as Context<EditorContextProviderValue>;

export default function EditorContextProvider(props: ParentProps) {
  const interpreter = new Interpreter();

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

  const problems = createMemo(() => interpreter.prepare(lines));
  const [breakpts, setBreakpts] = createSignal<Set<number>>(new Set());

  const editorHistory = new EditorHistory(editorState);

  return (
    <EditorContext.Provider
      value={{
        interpreter,
        editorState,
        editorDebugger: {
          problems,
          breakpts,
          toggleBreakpt(line) {
            setBreakpts((prev) => {
              const next = new Set(prev);
              if (next.has(line)) next.delete(line);
              else next.add(line);

              return next;
            });
          },
        },
        editorHistory,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  return useContext(EditorContext);
}
