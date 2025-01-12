import { ASTNode_Card, ASTNodeType } from "../../parse";

export default function getBlockLeaders(cards: ASTNode_Card[]) {
  // We do not need to add starting cards as leaders because they're implied
  const leaders = new Set<number>();

  // A block starts at...
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    if (card.type === ASTNodeType.CombinatorialCard) {
      // A combinatorial card
      if (i !== 0) leaders.add(i);

      // Target of a combinatorial card
      const jumpedTo = i + 1 + card.skips * (card.direction === "F" ? 1 : -1);
      if (jumpedTo !== 0) leaders.add(jumpedTo);

      // Card after a combinatorial card
      leaders.add(i + 1);
      continue;
    }
  }

  return leaders;
}
