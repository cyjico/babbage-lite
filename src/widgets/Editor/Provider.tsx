import {
  createContext,
  useContext,
  createSignal,
  JSX,
  Accessor,
  Setter,
} from "solid-js";
import { EditorSelection } from ".";

interface EditorContextProviderValue {
  selection: Accessor<EditorSelection | undefined>;
  _setSelection: Setter<EditorSelection | undefined>;
  lines: Accessor<string[]>;
  _setLines: Setter<string[]>;
}

const EditorContext = createContext<EditorContextProviderValue>({
  selection: () => undefined,
  _setSelection: () => undefined,
  lines: () => [],
  _setLines: () => undefined,
});

export default function EditorProvider(props: { children?: JSX.Element[] }) {
  const [selection, _setSelection] = createSignal<EditorSelection>();
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
      value={{ selection, _setSelection, lines, _setLines }}
    >
      {props.children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}
