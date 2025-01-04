import {
  createContext,
  useContext,
  createSignal,
  JSX,
  Accessor,
  Setter,
  createEffect,
} from "solid-js";
import EditorSelection from "./lib/EditorSelection";
import emulator from "@/entities/emulator";

interface EditorContextProviderValue {
  viewState: {
    sel: Accessor<EditorSelection | undefined>;
    _setSel: Setter<EditorSelection | undefined>;
    lines: Accessor<string[]>;
    _setLines: Setter<string[]>;
  };
}

const EditorContext = createContext<EditorContextProviderValue>({
  viewState: {
    sel: () => undefined,
    _setSel: () => undefined,
    lines: () => [],
    _setLines: () => [],
  },
});

export default function EditorContextProvider(props: {
  children?: JSX.Element[];
}) {
  const [sel, _setSel] = createSignal<EditorSelection>();
  const [lines, _setLines] = createSignal<string[]>([
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
    "L001         # Load end_num",
    "L000         # Load cur_num => EGRESS = end_num - cur_num",
    "CB?8         # If the result is negative, skip back to the loop start",
    "H            # Halt the program",
  ]);

  createEffect(() => {
    // TODO: Remove later! This is for testing the emulator.
    emulator.interpret(lines());
  });

  return (
    <EditorContext.Provider
      value={{ viewState: { sel, _setSel, lines, _setLines } }}
    >
      {props.children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  return useContext(EditorContext);
}
