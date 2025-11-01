import { SetStoreFunction } from "solid-js/store";
import { Accessor, Setter } from "solid-js";
import { Direction, Problem } from "@/shared/model/types";

export interface EditorSelection_serialized {
  lineIdxStart: number;
  offsetStart: number;
  lineIdxEnd: number;
  offsetEnd: number;
}

export interface EditorSelection extends EditorSelection_serialized {
  direction: Direction;
  toString: () => string;
}

export interface EditorState_serialized {
  sel: EditorSelection_serialized;
  lines: string[];
}

export interface EditorState extends EditorState_serialized {
  sel: EditorSelection
  _setSel: SetStoreFunction<EditorSelection>;
  _setLines: SetStoreFunction<string[]>;
}

export interface EditorHistory {
  undo: (curState: EditorState_serialized) => EditorState_serialized;
  redo: (curState: EditorState_serialized) => EditorState_serialized;
  canUndo: Accessor<boolean>;
  canRedo: Accessor<boolean>;
  commit: (curState: EditorState_serialized) => void;
}

export interface EditorContextProviderValue {
  editorHistory: EditorHistory;
  editorState: EditorState;
  editorDebugger: {
    problems: Accessor<Problem[]>;
    breakpts: Accessor<Set<number>>;
    _setBreakpts: Setter<Set<number>>;
  };
}
