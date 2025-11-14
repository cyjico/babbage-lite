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
import Emulator from "@/entities/emulator";

const EditorContext =
  createContext<EditorContextProviderValue>() as Context<EditorContextProviderValue>;

export default function EditorContextProvider(props: ParentProps) {
  const emulator = new Emulator();

  const [sel, _setSel] = createStore<EditorSelection>({
    lineIdxStart: 0,
    offsetStart: 0,
    lineIdxEnd: 0,
    offsetEnd: 0,
    direction: Direction.None,
    toString: () => "",
  });
  const [lines, _setLines] = createStore<string[]>([
    "# This program will print from 1 to 10",
    "N000 0       # cur_num",
    "N001 10      # end_num",
    "N002 1       # increment",
    "+",
    "L000         # Load cur_num",
    "L002         # Load increment => EGRESS = cur_num + increment",
    "S000         # Set cur_num to EGRESS",
    "P            # Print the result of the last arithmetic operation performed",
    "-",
    "L000         # Load cur_num",
    "L001         # Load end_num => EGRESS = cur_num - end_num",
    "CB?9         # If the result is negative, run-up lever (also known as lever) is set.",
    "H            # Halt the program",
    "# FAQ: Why is line 13 set to moving the reader 9 cards back? Should it not be 8?",
    "# It is 9 since the reader has to complete reading CB?9 before moving.",
    "# Therefore, we end up at H before actually moving the reader (we won't read H)",
  ]);
  const editorState = { sel, _setSel, lines, _setLines };

  const problems = createMemo(() => emulator.prepare(lines));
  const [breakpts, setBreakpts] = createSignal<Set<number>>(new Set());

  const editorHistory = new EditorHistory(editorState);

  return (
    <EditorContext.Provider
      value={{
        emulator,
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
