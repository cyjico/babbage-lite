import { ASTNode_Card } from "../../parse";

export type CFGBlock_ID = number;

export interface CFGBlock {
  id: CFGBlock_ID;
  cards: ASTNode_Card[];
  edges: CFGEdge[];
}

/**
 * Connects two CFG blocks with a condition (if any) when it jumps to that node
 */
export interface CFGEdge {
  to: CFGBlock_ID;
  condition?: "LEVER_SET";
}

/**
 * Control flow graph mapping IDs to corresponding blocks
 */
export type CFG = Map<CFGBlock_ID, CFGBlock>;
