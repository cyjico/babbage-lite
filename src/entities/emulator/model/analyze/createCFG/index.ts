import { ASTNode_Card, ASTNodeType } from "../../parse";
import getBlockLeaders from "./getBlockLeaders";
import { CFGEdge, CFGNode, CFGNode_ID } from "./types";

function createCFGNode(id: CFGNode_ID, edges: CFGEdge[] = []): CFGNode {
  return {
    id,
    cards: [],
    edges,
  };
}

export function createCFG(cards: ASTNode_Card[]): CFGNode[] {
  const blockLeaders = getBlockLeaders(cards);

  const cfg: CFGNode[] = [];
  let nodeToPush = createCFGNode(0);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    if (blockLeaders.has(i)) {
      nodeToPush.edges.push({
        to: i,
      });

      cfg.push(nodeToPush);
      nodeToPush = createCFGNode(i);

      if (card.type === ASTNodeType.CombinatorialCard) {
        nodeToPush.edges.push({
          to: i + 1 + card.skips * (card.direction === "F" ? 1 : -1),
          condition: "LEVER_SET",
        });
      }
    }

    nodeToPush.cards.push(card);
  }

  if (nodeToPush.cards.length > 0) cfg.push(nodeToPush);

  return cfg;
}
