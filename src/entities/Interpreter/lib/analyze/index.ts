import {
  cardReaderMovementOutOfBounds,
  multipleDefinitions,
  noArithmeticOperationPerformedPrior,
  noOperationSet,
  operationOverrides,
  unreachableCard,
  unusedAddress,
  unusedLoad,
  unusedOperationResult,
} from "../problemTemplates";
import { Problem } from "@/shared/model/types";
import {
  ASTNode_Card,
  ASTNode_NumberCard,
  ASTNode_OperationCard,
  ASTNode_VariableCard,
  ASTNodeType,
} from "../parse/types";
import { createCFG } from "./createCFG";
import analyzeCFG from "./analyzeCFG";
import insertSorted from "@/shared/lib/insertSorted";
import problemSeverityComparator from "../problemSeverityComparator";

const enum NextStep {
  ToOperation,
  ToE1,
  ToE2,
}

/**
 * Conduct semantic analysis on the abstract-syntax tree.
 *
 * @param cards Abstract-syntax tree.
 * @param problems Output array for problems detected.
 */
export default function analyze(
  cards: readonly ASTNode_Card[],
  problems: Problem[],
) {
  const definedAddresses = new Set<number>();
  const unusedAddresses = new Map<number, ASTNode_NumberCard>();
  const curOperation = {
    wasRecentResultUsed: false,
    operationCard: null as ASTNode_OperationCard | null,
    variableCard_L1: null as ASTNode_VariableCard | null,
    variableCard_L2: null as ASTNode_VariableCard | null,
    nextStep: NextStep.ToOperation,
  };

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    switch (card.type) {
      case ASTNodeType.NumberCard:
        if (definedAddresses.has(card.address)) {
          insertSorted(
            problems,
            multipleDefinitions(
              card.address,
              card.ln,
              card.col,
              card.number.colend,
            ),
            problemSeverityComparator,
          );
          break;
        }

        definedAddresses.add(card.address);
        unusedAddresses.set(card.address, card);
        break;
      case ASTNodeType.OperationCard:
        if (curOperation.operationCard !== null) {
          switch (curOperation.nextStep) {
            case NextStep.ToE1:
            case NextStep.ToE2:
              insertSorted(
                problems,
                operationOverrides(
                  curOperation.operationCard.ln,
                  card.ln,
                  card.col,
                  card.colend,
                ),
                problemSeverityComparator,
              );
              break;
          }
        }

        curOperation.operationCard = card;
        curOperation.nextStep = NextStep.ToE1;
        break;
      case ASTNodeType.ActionCard:
        if (card.action === "P") {
          if (
            curOperation.operationCard === null &&
            curOperation.variableCard_L2 === null
          ) {
            insertSorted(
              problems,
              noArithmeticOperationPerformedPrior(
                card.ln,
                card.col,
                card.colend,
              ),
              problemSeverityComparator,
            );
            break;
          }

          curOperation.wasRecentResultUsed = true;
        }

        break;
      case ASTNodeType.CombinatorialCard:
        if (card.condition === "?") {
          if (
            curOperation.operationCard === null &&
            curOperation.variableCard_L2 === null
          ) {
            insertSorted(
              problems,
              noArithmeticOperationPerformedPrior(
                card.ln,
                card.col,
                card.colend,
              ),
              problemSeverityComparator,
            );
            break;
          }

          curOperation.wasRecentResultUsed = true;
        }

        if (
          (card.direction === "F" && i + 1 + card.skips >= cards.length) ||
          (card.direction === "B" && i + 1 - card.skips < 0)
        ) {
          insertSorted(
            problems,
            cardReaderMovementOutOfBounds(card.ln, card.col, card.colend),
            problemSeverityComparator,
          );
        }
        break;
      case ASTNodeType.VariableCard:
        unusedAddresses.delete(card.address);

        switch (card.action) {
          case "L":
            switch (curOperation.nextStep) {
              // @ts-expect-error Fall through intended
              case NextStep.ToOperation:
                if (curOperation.operationCard === null)
                  insertSorted(
                    problems,
                    noOperationSet(card.ln, card.col, card.colend),
                    problemSeverityComparator,
                  );
              case NextStep.ToE1:
                // Check previous operation before overwriting
                if (
                  !curOperation.wasRecentResultUsed &&
                  curOperation.variableCard_L2 !== null
                ) {
                  insertSorted(
                    problems,
                    unusedOperationResult(
                      curOperation.variableCard_L1!.ln,
                      curOperation.variableCard_L1!.col,
                      curOperation.variableCard_L1!.colend,
                    ),
                    problemSeverityComparator,
                  );
                  insertSorted(
                    problems,
                    unusedOperationResult(
                      curOperation.variableCard_L2!.ln,
                      curOperation.variableCard_L2!.col,
                      curOperation.variableCard_L2!.colend,
                    ),
                    problemSeverityComparator,
                  );
                }

                curOperation.variableCard_L1 = card;
                curOperation.nextStep = NextStep.ToE2;
                break;
              case NextStep.ToE2:
                curOperation.variableCard_L2 = card;
                curOperation.nextStep = NextStep.ToOperation;
                curOperation.wasRecentResultUsed = false;
                break;
            }
            break;
          case "S":
            if (
              curOperation.operationCard === null &&
              curOperation.variableCard_L2 === null
            ) {
              insertSorted(
                problems,
                noArithmeticOperationPerformedPrior(
                  card.ln,
                  card.col,
                  card.colend,
                ),
                problemSeverityComparator,
              );
              break;
            }

            if (
              curOperation.nextStep === NextStep.ToE2 &&
              curOperation.variableCard_L1 !== null &&
              curOperation.variableCard_L2 !== null
            ) {
              insertSorted(
                problems,
                unusedLoad(
                  curOperation.variableCard_L1.ln,
                  curOperation.variableCard_L1.col,
                  curOperation.variableCard_L1.colend,
                ),
                problemSeverityComparator,
              );
            }

            curOperation.wasRecentResultUsed = true;
            break;
        }
        break;
    }
  }

  for (const [address, ref_node] of unusedAddresses) {
    insertSorted(
      problems,
      unusedAddress(address, ref_node.ln, ref_node.col, ref_node.number.colend),
      problemSeverityComparator,
    );
  }

  if (
    !curOperation.wasRecentResultUsed &&
    curOperation.variableCard_L2 !== null &&
    curOperation.operationCard !== null
  ) {
    insertSorted(
      problems,
      unusedOperationResult(
        curOperation.variableCard_L1!.ln,
        curOperation.variableCard_L1!.col,
        curOperation.variableCard_L1!.colend,
      ),
      problemSeverityComparator,
    );
    insertSorted(
      problems,
      unusedOperationResult(
        curOperation.variableCard_L2!.ln,
        curOperation.variableCard_L2!.col,
        curOperation.variableCard_L2!.colend,
      ),
      problemSeverityComparator,
    );
  }

  const cfg = createCFG(cards);
  const cfgAnalysisReport = analyzeCFG(cfg);

  for (const id of cfgAnalysisReport.unreachable) {
    for (const card of cfg.get(id)!.cards) {
      insertSorted(
        problems,
        unreachableCard(card.ln, card.col, card.colend),
        problemSeverityComparator,
      );
    }
  }
}
