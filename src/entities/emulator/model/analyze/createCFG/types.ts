import { ASTNode_Card } from "../../parse";

export type CFGNode_ID = number;

export interface CFGNode {
  id: CFGNode_ID;
  cards: ASTNode_Card[];
  edges: CFGEdge[];
}

export interface CFGEdge {
  to: CFGNode_ID;
  condition?: "LEVER_SET";
}

export type CFG = Map<CFGNode_ID, CFGNode>;
