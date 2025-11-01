import { createSignal } from "solid-js";
import { EditorHistory, EditorState_serialized } from "../../model";
import serializeEditorState from "../serializeEditorState";

export default function createEditorHistory(
  onRequestEditorStateChange: (newState: EditorState_serialized) => void,
): EditorHistory {
  const undoStack: EditorState_serialized[] = [];
  const redoStack: EditorState_serialized[] = [];

  const [canUndo, setCanUndo] = createSignal(false);
  const [canRedo, setCanRedo] = createSignal(false);

  return {
    undo: (curState) => {
      console.log("just undid");
      const newState = undoStack.pop();
      if (newState === undefined) return curState;

      setCanUndo(undoStack.length !== 0);

      onRequestEditorStateChange(newState);
      return newState;
    },
    redo: (curState) => {
      const newState = redoStack.pop();
      if (newState === undefined) return curState;

      undoStack.push(curState);
      setCanRedo(redoStack.length !== 0);

      onRequestEditorStateChange(newState);
      return newState;
    },
    canUndo,
    canRedo,
    commit: (curState) => {
      if (undoStack.length > 24) undoStack.splice(undoStack.length - 1, 1);

      undoStack.push(serializeEditorState(curState));
      redoStack.length = 0;
      setCanUndo(true);
      setCanRedo(false);
    },
  };
}
