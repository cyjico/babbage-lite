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
      const prevLeader = curNode.cards[0];

      curNode.edges.push({
        to: i,
      });

      if (prevLeader && prevLeader.type === ASTNodeType.CombinatorialCard) {
        const jumpedTo =
          i + 1 + prevLeader.skips * (prevLeader.direction === "F" ? 1 : -1);

        if (jumpedTo >= 0 && jumpedTo < cards.length) {
          if (prevLeader.condition === "?") {
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
