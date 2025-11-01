import { produce } from "solid-js/store";
import { EditorContextProviderValue_State } from "../../ContextProvider";
import setSelection from "./setSelection";

export default function onInsertFrom(
  rawData: Readonly<string>,
  content: () => HTMLDivElement,
  editorState: EditorContextProviderValue_State,
) {
  const data = rawData.split(/(?:\r\n|\r|\n)/g);
  if (data.length === 0) return;

  const oldEndLine = editorState.lines[editorState.sel.lineIdxEnd].slice(
    editorState.sel.offsetEnd,
  );
  const newLineIdxEnd = editorState.sel.lineIdxStart + data.length - 1;

  editorState._setLines(
    produce((lines) => {
      // Insert first datum
      lines[editorState.sel.lineIdxStart] = lines[editorState.sel.lineIdxStart]
        .slice(0, editorState.sel.offsetStart)
        .concat(data[0]);

      // Delete lines between
      lines.splice(
        editorState.sel.lineIdxStart + 1,
        Math.max(0, editorState.sel.lineIdxEnd - editorState.sel.lineIdxStart),
      );

      // Finally insert the remaining data
      for (let i = 1; i < data.length; i++) {
        const datum = data[i];

        lines.splice(editorState.sel.lineIdxStart + i, 0, datum);
      }

      lines[newLineIdxEnd] = lines[newLineIdxEnd].concat(oldEndLine);
    }),
  );

  editorState._setSel(
    produce((sel) => {
      sel.lineIdxEnd = sel.lineIdxStart = newLineIdxEnd;
      sel.offsetStart = sel.offsetEnd =
        data.length === 1
          ? sel.offsetStart + data[0].length
          : data[data.length - 1].length;
    }),
  );
  setSelection(content(), editorState.sel);
}
