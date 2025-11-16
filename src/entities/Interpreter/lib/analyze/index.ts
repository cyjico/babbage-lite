import {
  cardReaderMovementOutOfBounds,
  multipleDefinitions,
  noArithmeticOperationPerformedPrior,
  neverHalts,
  noOperationSet,
  operationOverrides,
  unreachableCard,
  unusedAddress,
  unusedLoad,
  unusedOperationResult,
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

const enum NextStep {
  ToOperation,
  ToE1,
  ToE2,
}

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
          out_problems.push(
            multipleDefinitions(card.address, card.ln, card.col, card.colend),
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
              out_problems.push(
                operationOverrides(
                  curOperation.operationCard.ln,
                  card.ln,
                  card.col,
                  card.colend,
                ),
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
            out_problems.push(
              noArithmeticOperationPerformedPrior(
                card.ln,
                card.col,
                card.colend,
              ),
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
            out_problems.push(
              noArithmeticOperationPerformedPrior(
                card.ln,
                card.col,
                card.colend,
              ),
            );
            break;
          }

          curOperation.wasRecentResultUsed = true;
        }

        if (
          (card.direction === "F" && i + 1 + card.skips >= cards.length) ||
          (card.direction === "B" && i + 1 - card.skips < 0)
        ) {
          out_problems.push(
            cardReaderMovementOutOfBounds(card.ln, card.col, card.colend),
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
                  out_problems.push(
                    noOperationSet(card.ln, card.col, card.colend),
                  );
              case NextStep.ToE1:
                // Check previous operation before overwriting
                if (
                  !curOperation.wasRecentResultUsed &&
                  curOperation.variableCard_L2 !== null
                ) {
                  out_problems.push(
                    unusedOperationResult(
                      curOperation.variableCard_L1!.ln,
                      curOperation.variableCard_L1!.col,
                      curOperation.variableCard_L1!.colend,
                    ),
                  );
                  out_problems.push(
                    unusedOperationResult(
                      curOperation.variableCard_L2!.ln,
                      curOperation.variableCard_L2!.col,
                      curOperation.variableCard_L2!.colend,
                    ),
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
              out_problems.push(
                noArithmeticOperationPerformedPrior(
                  card.ln,
                  card.col,
                  card.colend,
                ),
              );
              break;
            }

            if (
              curOperation.nextStep === NextStep.ToE2 &&
              curOperation.variableCard_L1 !== null &&
              curOperation.variableCard_L2 !== null
            ) {
              out_problems.push(
                unusedLoad(
                  curOperation.variableCard_L1.ln,
                  curOperation.variableCard_L1.col,
                  curOperation.variableCard_L1.colend,
                ),
              );
            }

            curOperation.wasRecentResultUsed = true;
            break;
        }
        break;
    }
  }

  for (const [address, ref_node] of unusedAddresses) {
    out_problems.push(
      unusedAddress(address, ref_node.ln, ref_node.col, ref_node.colend),
    );
  }

  if (
    !curOperation.wasRecentResultUsed &&
    curOperation.variableCard_L2 !== null &&
    curOperation.operationCard !== null
  ) {
    out_problems.push(
      unusedOperationResult(
        curOperation.variableCard_L1!.ln,
        curOperation.variableCard_L1!.col,
        curOperation.variableCard_L1!.colend,
      ),
    );
    out_problems.push(
      unusedOperationResult(
        curOperation.variableCard_L2!.ln,
        curOperation.variableCard_L2!.col,
        curOperation.variableCard_L2!.colend,
      ),
    );
  }

  const cfg = createCFG(cards);
  const cfgAnalysisReport = analyzeCFG(cfg);

  if (!cfgAnalysisReport.halts) {
    const lastCard = cards[cards.length - 1];

    out_problems.push(
      neverHalts(lastCard?.ln ?? 0, lastCard?.col ?? 0, lastCard?.colend ?? 1),
    );
  }

  for (const id of cfgAnalysisReport.unreachable) {
    for (const card of cfg.get(id)!.cards) {
      out_problems.push(unreachableCard(card.ln, card.col, card.colend));
    }
  }
}
