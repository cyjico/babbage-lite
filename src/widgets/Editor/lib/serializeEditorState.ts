import { EditorState, EditorState_serialized } from "../model";

export default function serializeEditorState(
  state: EditorState_serialized | EditorState,
): EditorState_serialized {
  return {
    lines: state.lines.slice(),
    sel: {
      lineIdxStart: state.sel.lineIdxStart,
      offsetStart: state.sel.offsetStart,
      lineIdxEnd: state.sel.lineIdxEnd,
      offsetEnd: state.sel.offsetEnd,
    },
  };
}
