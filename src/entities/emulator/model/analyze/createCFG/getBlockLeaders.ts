import { ASTNode_Card, ASTNodeType } from "../../parse";

export default function getBlockLeaders(cards: ASTNode_Card[]) {
  const leaders = new Set<number>();

  // A block starts at...
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    if (card.type === ASTNodeType.CombinatorialCard) {
      // Combinatorial card
      leaders.add(i);

      // Target of the combinatorial card
      leaders.add(i + 1 + card.skips * (card.direction === "F" ? 1 : -1));

      // Card after the combinatorial card
      leaders.add(++i);
      continue;
    }

    // Starting card (no need to add them in the set)
  }

  return leaders;
}
