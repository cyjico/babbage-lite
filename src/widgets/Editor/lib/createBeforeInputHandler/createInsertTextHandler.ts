import { produce } from "solid-js/store";
import { EditorState } from "../../model/types";

export default function createInsertTextHandler(editorState: EditorState) {
  return (data: string) => {
    editorState.setLines(
      produce((lines) => {
        // Set end line content
        lines[editorState.sel.lineIdxEnd] = lines[editorState.sel.lineIdxStart]
          .slice(0, editorState.sel.offsetStart)
          .concat(
            data,
            lines[editorState.sel.lineIdxEnd].slice(editorState.sel.offsetEnd),
          );

        // Delete lines
        lines.splice(
          editorState.sel.lineIdxStart,
          editorState.sel.lineIdxEnd - editorState.sel.lineIdxStart,
        );
      }),
    );

    editorState.setSel(
      produce((sel) => {
        sel.lineIdxEnd = sel.lineIdxStart;
        sel.offsetStart += 1;
        sel.offsetEnd = sel.offsetStart;
      }),
    );
  };
}
