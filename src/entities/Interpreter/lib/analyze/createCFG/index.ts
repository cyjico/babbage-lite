import wrap from "@/shared/lib/wrap";
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
    const nextIdx = (i + 1) % cards.length;
    curBlock.cards.push(cards[i]);

    if (leaders.has(nextIdx)) {
      finalizeBlock(curBlock, nextIdx, cards);

      cfg.set(curBlock.id, curBlock);

      // Ready the next block
      curBlock = createCFGBlock(nextIdx);
    }
  }

  if (curBlock.cards.length !== 0) finalizeBlock(curBlock, 0, cards);

  return cfg;
}

function finalizeBlock(
  block: CFGBlock,
  nextIdx: number,
  cards: readonly ASTNode_Card[],
) {
  const firstCard = block.cards[0];

  if (firstCard.type !== ASTNodeType.ActionCard || firstCard.action !== "H") {
    block.edges.push({
      to: nextIdx,
    });

    if (firstCard.type === ASTNodeType.CombinatorialCard) {
      // firstCard being a combinatorial implies there's only one card:
      // 1.) curNode.cards.length === 1
      // 2.) i for firstCard is equal to i - 1
      // 3.) i - 1 + 1 can be simplified to 1
      const jumpedTo = wrap(
        nextIdx + firstCard.skips * (firstCard.direction === "F" ? 1 : -1),
        cards.length,
      );

      if (firstCard.condition === "?") {
        block.edges.push({
          to: jumpedTo,
          condition: "LEVER_SET",
        });
      } else {
        block.edges[0].to = jumpedTo;
      }
    }
  }
}

export * from "./types";
