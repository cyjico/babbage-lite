import emulator from "@/entities/emulator";
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
import { EditorContextProviderValue, EditorSelection } from "./model";
import EditorHistory from "./model/EditorHistory";

const EditorContext =
  createContext<EditorContextProviderValue>() as Context<EditorContextProviderValue>;

export default function EditorContextProvider(props: ParentProps) {
  const [sel, _setSel] = createStore<EditorSelection>({
    lineIdxStart: 0,
    offsetStart: 0,
    lineIdxEnd: 0,
    offsetEnd: 0,
    direction: Direction.None,
    toString: () => "",
  });
  const [lines, _setLines] = createStore<string[]>([""]);
  const editorState = { sel, _setSel, lines, _setLines };

  const problems = createMemo(() => emulator.prepare(lines));
  const [breakpts, setBreakpts] = createSignal<Set<number>>(new Set());

  const editorHistory = new EditorHistory(editorState);

  return (
    <EditorContext.Provider
      value={{
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
