import { ASTNode_Card } from "../../parse";

export type CFGNode_ID = number;

export interface CFGNode {
  id: CFGNode_ID;
  cards: ASTNode_Card[];
  edges: CFGEdge[];
}

/**
 * Connects two CFG nodes with a condition (if any) when it jumps to that node
 */
export interface CFGEdge {
  to: CFGNode_ID;
  condition?: "LEVER_SET";
}

/**
 * Control flow graph mapping node IDs (in-sequence) to nodes
 */
export type CFG = Map<CFGNode_ID, CFGNode>;
