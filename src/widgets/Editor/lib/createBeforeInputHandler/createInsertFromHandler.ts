import { produce } from "solid-js/store";
import { EditorState } from "../../model";

export default function createInsertFromHandler(editorState: EditorState) {
  return (data: string) => {
    const pdata = data.split(/(?:\r\n|\r|\n)/g);
    if (pdata.length === 0) return;

    const oldEndLine = editorState.lines[editorState.sel.lineIdxEnd].slice(
      editorState.sel.offsetEnd,
    );
    const newLineIdxEnd = editorState.sel.lineIdxStart + pdata.length - 1;

    editorState._setLines(
      produce((lines) => {
        // Insert first datum
        lines[editorState.sel.lineIdxStart] = lines[
          editorState.sel.lineIdxStart
        ]
          .slice(0, editorState.sel.offsetStart)
          .concat(pdata[0]);

        // Delete lines between
        lines.splice(
          editorState.sel.lineIdxStart + 1,
          Math.max(
            0,
            editorState.sel.lineIdxEnd - editorState.sel.lineIdxStart,
          ),
        );

        // Finally insert the remaining data
        for (let i = 1; i < pdata.length; i++) {
          const datum = pdata[i];

          lines.splice(editorState.sel.lineIdxStart + i, 0, datum);
        }

        lines[newLineIdxEnd] = lines[newLineIdxEnd].concat(oldEndLine);
      }),
    );

    editorState._setSel(
      produce((sel) => {
        sel.lineIdxEnd = sel.lineIdxStart = newLineIdxEnd;
        sel.offsetStart = sel.offsetEnd =
          pdata.length === 1
            ? sel.offsetStart + pdata[0].length
            : pdata[pdata.length - 1].length;
      }),
    );
  };
}
