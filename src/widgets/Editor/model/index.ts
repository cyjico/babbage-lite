import { SetStoreFunction } from "solid-js/store";
import { Accessor, Setter } from "solid-js";
import { Direction, Problem } from "@/shared/model/types";

/**
 * Separate from ..._serialized to prevent accidentally saving one to the other
 */
export interface EditorSelection {
  lineIdxStart: number;
  offsetStart: number;
  lineIdxEnd: number;
  offsetEnd: number;
  direction: Direction;
  toString: () => string;
}

export interface EditorSelection_serialized {
  lineIdxStart: number;
  offsetStart: number;
  lineIdxEnd: number;
  offsetEnd: number;
}

/**
 * Separate from ..._serialized to prevent accidentally saving one to the other
 */
export interface EditorState {
  sel: EditorSelection;
  lines: string[];
  _setSel: SetStoreFunction<EditorSelection>;
  _setLines: SetStoreFunction<string[]>;
}

export interface EditorState_serialized {
  sel: EditorSelection_serialized;
  lines: string[];
}

export interface EditorHistory {
  undo: (curState: EditorState) => EditorState_serialized;
  redo: (curState: EditorState) => EditorState_serialized;
  canUndo: Accessor<boolean>;
  canRedo: Accessor<boolean>;
  commit: (curState: EditorState) => void;
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
