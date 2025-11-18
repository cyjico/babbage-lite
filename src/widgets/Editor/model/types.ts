import { SetStoreFunction } from "solid-js/store";
import { Direction } from "@/shared/model/types";

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
  setSel: SetStoreFunction<EditorSelection>;
  setLines: SetStoreFunction<string[]>;
}

export interface EditorState_serialized {
  sel: EditorSelection_serialized;
  lines: string[];
}
