import {
  createContext,
  useContext,
  createSignal,
  JSX,
  Accessor,
  Setter,
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
  const [lines, _setLines] = createSignal<string[]>(
    [
      "N000 10",
      "N001 5",
      "",
      "L000",
      `# Yes, shit... Yes, thank you so much... Thank you... That might just what I need to buss, and thats just what I need to buss, and ambasing! Aughh! Ambasing! Augh!! Ambasing!! Auughhh shit aaauughhh! Auuughh shit! Aughh!`,
    ].concat(Array(25).fill("")),
  );

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
