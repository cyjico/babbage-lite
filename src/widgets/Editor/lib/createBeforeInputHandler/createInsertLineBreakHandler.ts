import { produce } from "solid-js/store";
import { EditorState } from "../../model/types";

export default function createInsertLineBreakHandler(editorState: EditorState) {
  return () => {
    editorState._setLines(
      produce((lines) => {
        // Insert new line and delete lines
        lines.splice(
          editorState.sel.lineIdxStart + 1,
          editorState.sel.lineIdxEnd - editorState.sel.lineIdxStart,
          lines[editorState.sel.lineIdxEnd].slice(editorState.sel.offsetEnd),
        );

        // Delete start line content
        lines[editorState.sel.lineIdxStart] = lines[
          editorState.sel.lineIdxStart
        ].slice(0, editorState.sel.offsetStart);
      }),
    );

    editorState._setSel(
      produce((sel) => {
        sel.lineIdxStart += 1;
        sel.lineIdxEnd = sel.lineIdxStart;
        sel.offsetStart = sel.offsetEnd = 0;
      }),
    );
  };
}
