import {
  cardReaderMovementOutOfBounds,
  multipleDefinitions,
  noArithmeticOperationPerformedPrior,
  noOperationSet,
  operationOverrides,
  undefinedAddress,
  unusedAddress,
} from "@/shared/lib/problemTemplates";
import { Problem } from "@/shared/model/types";
import {
  ASTNode_Card,
  ASTNode_NumberCard,
  ASTNode_OperationCard,
  ASTNode_VariableCard,
  ASTNodeType,
} from "../parse";
import { createCFG } from "./createCFG";
import analyzeCFG from "./analyzeCFG";

/**
 * Conduct semantic analysis on the abstract-syntax tree.
 *
 * @param cards Abstract-syntax tree.
 * @param out_problems Output array for problems detected.
 */
export default function analyze(
  cards: ASTNode_Card[],
  out_problems: Problem[],
) {
  const definedAddresses = new Set<number>();
  const unusedAddresses = new Map<number, ASTNode_NumberCard>();
  let wasPreviousOperationPerformed = false;
  const operationToPerform = {
    operationCard: null as ASTNode_OperationCard | null,
    variableCard_L1: null as ASTNode_VariableCard | null,
  };

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    switch (card.type) {
      case ASTNodeType.NumberCard:
        if (definedAddresses.has(card.address)) {
          out_problems.push(
            multipleDefinitions(card.address, card.ln, card.col, card.col + 4),
          );
          break;
        }

        definedAddresses.add(card.address);
        unusedAddresses.set(card.address, card);
        break;
      case ASTNodeType.OperationCard:
        if (
          operationToPerform.operationCard &&
          operationToPerform.variableCard_L1
        ) {
          out_problems.push(
            operationOverrides(
              operationToPerform.operationCard.ln,
              card.ln,
              card.col,
              card.col + 1,
            ),
          );
          break;
        }

        operationToPerform.operationCard = card;
        break;
      case ASTNodeType.ActionCard:
        if (card.action === "P" && !wasPreviousOperationPerformed) {
          out_problems.push(
            noArithmeticOperationPerformedPrior(
              card.ln,
              card.col,
              card.col + 1,
            ),
          );
          break;
        }

        break;
      case ASTNodeType.CombinatorialCard:
        if (
          (card.direction === "F" && i + 1 + card.skips >= cards.length) ||
          (card.direction === "B" && i + 1 - card.skips < 0)
        )
          out_problems.push(
            cardReaderMovementOutOfBounds(
              card.ln,
              card.col,
              card.col + 3 + card.skips.toString().length,
            ),
          );
        break;
      case ASTNodeType.VariableCard:
        if (!definedAddresses.has(card.address)) {
          out_problems.push(
            undefinedAddress(card.address, card.ln, card.col, card.col + 4),
          );
          break;
        }

        unusedAddresses.delete(card.address);

        switch (card.action) {
          case "L":
            if (operationToPerform.variableCard_L1 === null) {
              operationToPerform.variableCard_L1 = card;
            } else {
              // variableCard_L2
              if (
                !wasPreviousOperationPerformed &&
                !operationToPerform.operationCard
              ) {
                out_problems.push(
                  noOperationSet(card.ln, card.col, card.col + 4),
                );
              } else {
                wasPreviousOperationPerformed = true;
              }

              operationToPerform.operationCard = null;
              operationToPerform.variableCard_L1 = null;
            }

            break;
          case "S":
            if (!wasPreviousOperationPerformed) {
              out_problems.push(
                noArithmeticOperationPerformedPrior(
                  card.ln,
                  card.col,
                  card.col + 1,
                ),
              );
            }
            break;
        }
        break;
    }
  }

  for (const [address, ref_node] of unusedAddresses) {
    out_problems.push(
      unusedAddress(address, ref_node.ln, ref_node.col, ref_node.col + 4),
    );
  }

  if (operationToPerform.variableCard_L1) {
    out_problems.push(
      noOperationSet(
        operationToPerform.variableCard_L1.ln,
        operationToPerform.variableCard_L1.col,
        operationToPerform.variableCard_L1.col + 4,
      ),
    );
  }

  const cfg = createCFG(cards);
  console.log("createCFG():", cfg);
  const [hasCycle, unreachableCFGNodes] = analyzeCFG(cfg);
  console.log("analyzeCFG():", `hasCycle: ${hasCycle}`, unreachableCFGNodes);
}
