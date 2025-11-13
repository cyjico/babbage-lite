import { Accessor, createSignal, Setter } from "solid-js";
import { EditorState, EditorState_serialized } from "./types";

export default class EditorHistory {
  #undoStack: EditorState_serialized[] = [];
  #redoStack: EditorState_serialized[] = [];

  canUndo: Accessor<boolean>;
  #setCanUndo: Setter<boolean>;
  canRedo: Accessor<boolean>;
  #setCanRedo: Setter<boolean>;

  #editorState: EditorState;

  constructor(editorState: EditorState) {
    [this.canUndo, this.#setCanUndo] = createSignal(false);
    [this.canRedo, this.#setCanRedo] = createSignal(false);

    this.#editorState = editorState;
  }

  undo() {
    const newState = this.#undoStack.pop();
    if (newState === undefined) return;

    this.#redoStack.push(serializeEditorState(this.#editorState));
    this.#setCanUndo(this.#undoStack.length !== 0);

    this.#editorState._setSel(newState.sel);
    this.#editorState._setLines(newState.lines);
  }

  redo() {
    const newState = this.#redoStack.pop();
    if (newState === undefined) return;

    this.#undoStack.push(serializeEditorState(this.#editorState));
    this.#setCanRedo(this.#redoStack.length !== 0);

    this.#editorState._setSel(newState.sel);
    this.#editorState._setLines(newState.lines);
  }

  _commit() {
    if (this.#undoStack.length > 24)
      this.#undoStack.splice(this.#undoStack.length - 1, 1);

    this.#undoStack.push(serializeEditorState(this.#editorState));
    this.#redoStack.length = 0;
    this.#setCanUndo(true);
    this.#setCanRedo(false);
  }
}

function serializeEditorState(
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
