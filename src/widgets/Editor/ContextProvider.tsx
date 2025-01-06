import emulator from "@/entities/emulator";
import createProblemOutput from "@/shared/lib/createProblemOutput";
import { ProblemSeverity } from "@/shared/model/types";
import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  JSX,
  Setter,
  useContext,
} from "solid-js";
import EditorSelection from "./lib/EditorSelection";

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
    "L000         # Load cur_num",
    "L001         # Load end_num => EGRESS = cur_num - end_num",
    "CB?9         # If the result is negative, run-up lever (also known as lever) is set.",
    "H            # Halt the program",
    "# FAQ: Why is line 13 set to moving the reader 9 cards back? Should it not be 8?",
    "# It is 9 since the reader has to complete reading CB?9 before moving.",
    "# Therefore, we end up at line 14 before actually moving the reader.",
  ]);

  createEffect(() => {
    // TODO: Remove later! This is for testing the emulator.
    const problems = emulator.prepare(lines());

    for (const problem of problems) {
      switch (problem.severity) {
        case ProblemSeverity.Error:
          console.error(createProblemOutput(lines(), problem));
          break;
        case ProblemSeverity.Warning:
          console.warn(createProblemOutput(lines(), problem));
          break;
        case ProblemSeverity.Information:
          console.log(createProblemOutput(lines(), problem));
          break;
      }
    }
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
