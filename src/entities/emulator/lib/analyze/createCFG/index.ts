import { ASTNode_Card, ASTNodeType } from "../../parse";
import getBlockLeaders from "./getBlockLeaders";
import { CFG, CFGEdge, CFGBlock, CFGBlock_ID } from "./types";

function createCFGBlock(id: CFGBlock_ID, edges: CFGEdge[] = []): CFGBlock {
  return {
    id,
    cards: [],
    edges,
  };
}

export function createCFG(cards: ASTNode_Card[]): CFG {
  const leaders = getBlockLeaders(cards);

  const cfg: CFG = new Map();
  let curBlock = createCFGBlock(0);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    if (leaders.has(i)) {
      // Finalize the current block
      curBlock.edges.push({
        to: i,
      });

      const firstCard = curBlock.cards[0];
      if (firstCard.type === ASTNodeType.CombinatorialCard) {
        // firstCard being a combinatorial implies there's only one card:
        // 1.) curNode.cards.length === 1
        // 2.) i for firstCard is equal to i - 1
        // 3.) i - 1 + 1 can be simplified to 1
        const jumpedTo =
          i + firstCard.skips * (firstCard.direction === "F" ? 1 : -1);

        if (jumpedTo >= 0 && jumpedTo < cards.length) {
          if (firstCard.condition === "?") {
            curBlock.edges.push({
              to: jumpedTo,
              condition: "LEVER_SET",
            });
          } else {
            curBlock.edges[0].to = jumpedTo;
          }
        }
      }

      cfg.set(curBlock.id, curBlock);
      // Create a new block
      curBlock = createCFGBlock(i);
    }

    curBlock.cards.push(card);
  }

  if (curBlock.cards.length > 0) cfg.set(curBlock.id, curBlock);

  return cfg;
}

export * from "./types";
