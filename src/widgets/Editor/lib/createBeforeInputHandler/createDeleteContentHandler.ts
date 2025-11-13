import { produce } from "solid-js/store";
import { EditorState } from "../../model/types";

export default function createDeleteContentHandler(editorState: EditorState) {
  return (inputType: string) => {
    if (
      editorState.sel.lineIdxStart != editorState.sel.lineIdxEnd ||
      editorState.sel.offsetStart != editorState.sel.offsetEnd
    ) {
      editorState._setLines(
        produce((lines) => {
          // Set end line content
          lines[editorState.sel.lineIdxEnd] = lines[
            editorState.sel.lineIdxStart
          ]
            .slice(0, editorState.sel.offsetStart)
            .concat(
              lines[editorState.sel.lineIdxEnd].slice(
                editorState.sel.offsetEnd,
              ),
            );

          // Delete lines
          lines.splice(
            editorState.sel.lineIdxStart,
            editorState.sel.lineIdxEnd - editorState.sel.lineIdxStart,
          );
        }),
      );

      editorState._setSel(
        produce((sel) => {
          sel.lineIdxEnd = sel.lineIdxStart;
          sel.offsetEnd = sel.offsetStart;
        }),
      );

      return;
    }

    switch (inputType) {
      case "deleteContent":
      case "deleteContentBackward":
        if (editorState.sel.offsetStart !== 0) {
          editorState._setLines(
            produce((lines) => {
              lines[editorState.sel.lineIdxStart] = lines[
                editorState.sel.lineIdxStart
              ]
                .slice(0, editorState.sel.offsetStart - 1)
                .concat(
                  lines[editorState.sel.lineIdxStart].slice(
                    editorState.sel.offsetStart,
                  ),
                );
            }),
          );

          editorState._setSel(
            produce((sel) => {
              sel.offsetStart = Math.max(sel.offsetStart - 1, 0);
              sel.offsetEnd = sel.offsetStart;
            }),
          );
        } else if (editorState.sel.lineIdxStart !== 0) {
          const prevLineLength =
            editorState.lines[editorState.sel.lineIdxStart - 1].length;

          editorState._setLines(
            produce((lines) => {
              lines[editorState.sel.lineIdxStart - 1] = lines[
                editorState.sel.lineIdxStart - 1
              ].concat(
                lines[editorState.sel.lineIdxStart].slice(
                  editorState.sel.offsetStart,
                ),
              );

              lines.splice(editorState.sel.lineIdxStart, 1);
            }),
          );

          editorState._setSel(
            produce((sel) => {
              sel.lineIdxStart -= 1;
              sel.lineIdxEnd = sel.lineIdxStart;
              sel.offsetStart = sel.offsetEnd = prevLineLength;
            }),
          );
        }
        break;
      case "deleteContentForward":
        if (
          editorState.sel.offsetStart !==
          editorState.lines[editorState.sel.lineIdxStart].length
        ) {
          editorState._setLines(
            produce((lines) => {
              lines[editorState.sel.lineIdxStart] = lines[
                editorState.sel.lineIdxStart
              ]
                .slice(0, editorState.sel.offsetStart)
                .concat(
                  lines[editorState.sel.lineIdxStart].slice(
                    editorState.sel.offsetStart + 1,
                  ),
                );
            }),
          );
        } else if (
          editorState.sel.lineIdxStart !==
          editorState.lines.length - 1
        ) {
          editorState._setLines(
            produce((lines) => {
              lines[editorState.sel.lineIdxStart] = lines[
                editorState.sel.lineIdxStart
              ].concat(lines[editorState.sel.lineIdxStart + 1]);

              lines.splice(editorState.sel.lineIdxStart + 1, 1);
            }),
          );
        }
        break;
    }
  };
}
