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
  const [lines, _setLines] = createSignal<string[]>(
    [
      "N000 4",
      "N001 3.28",
      "N002 1",
      "*",
      "L000",
      "L001",
      "S002",
      "P",
      "CF!1",
      "B # I will get skipped...",
      "H",
      `# Yes, shit... Yes, thank you so much... Thank you... That might just what I need to buss, and thats just what I need to buss, and ambasing! Aughh! Ambasing! Augh!! Ambasing!! Auughhh shit aaauughhh! Auuughh shit! Aughh!`,
    ].concat(Array(18).fill("")),
  );

  // TODO: For testing purposes, please remove later.
  createEffect(() => {
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
