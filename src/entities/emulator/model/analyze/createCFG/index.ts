import { ASTNode_Card, ASTNodeType } from "../../parse";
import getBlockLeaders from "./getBlockLeaders";
import { CFG, CFGEdge, CFGNode, CFGNode_ID } from "./types";

function createCFGNode(id: CFGNode_ID, edges: CFGEdge[] = []): CFGNode {
  return {
    id,
    cards: [],
    edges,
  };
}

export function createCFG(cards: ASTNode_Card[]): CFG {
  const leaders = getBlockLeaders(cards);

  const cfg: CFG = new Map();
  let curNode = createCFGNode(0);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    if (leaders.has(i)) {
      // Connect edges just before completion
      curNode.edges.push({
        to: i,
      });

      const firstCard = curNode.cards[0];
      if (firstCard.type === ASTNodeType.CombinatorialCard) {
        // Implications:
        // * curNode.cards.length === 1
        // * i for firstCard is equal to i - 1
        // * i - 1 + 1 can be simplified to 1
        const jumpedTo =
          i + firstCard.skips * (firstCard.direction === "F" ? 1 : -1);

        if (jumpedTo >= 0 && jumpedTo < cards.length) {
          if (firstCard.condition === "?") {
            curNode.edges.push({
              to: jumpedTo,
              condition: "LEVER_SET",
            });
          } else {
            curNode.edges[0].to = jumpedTo;
          }
        }
      }

      cfg.set(curNode.id, curNode);
      curNode = createCFGNode(i);
    }

    curNode.cards.push(card);
  }

  if (curNode.cards.length > 0) cfg.set(curNode.id, curNode);

  return cfg;
}

export * from "./types";
