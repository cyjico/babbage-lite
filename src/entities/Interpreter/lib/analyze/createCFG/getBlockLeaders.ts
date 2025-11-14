import wrap from "@/shared/lib/wrap";
import { ASTNode_Card, ASTNodeType } from "../../parse";

/**
 * Block leaders are the first cards of basic blocks in a control flow graph.
 *
 * @param cards
 * @returns Indices of the cards who are block leaders
 */
export default function getBlockLeaders(cards: ASTNode_Card[]) {
  // We do not need to add starting cards as leaders because they're implied
  const leaders = new Set<number>();

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    if (card.type === ASTNodeType.CombinatorialCard) {
      // A block starts at a combinatorial card...
      if (i !== 0) leaders.add(i);

      // And where it jumps to...
      const jumpedTo = wrap(
        i + 1 + card.skips * (card.direction === "F" ? 1 : -1),
        cards.length,
      );
      if (jumpedTo !== 0) leaders.add(jumpedTo % cards.length);

      // And the card after it
      leaders.add((i + 1) % cards.length);
    } else if (card.type === ASTNodeType.ActionCard && card.action === "H") {
      // A block starts at a halt action card...
      leaders.add(i);

      // And the card after it
      leaders.add((i + 1) % cards.length);
    }
  }

  return leaders;
}
