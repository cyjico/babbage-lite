import {
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
  ASTNodeType,
  ASTNode_NumberCard,
  ASTNode_OperationCard,
  ASTNode_VariableCard,
} from "../parse";

/**
 * Conduct semantic analysis on the abstract-syntax tree.
 *
 * @param nodes Abstract-syntax tree.
 * @param out_problems Output array for problems detected.
 */
export default function analyze(nodes: ASTNode_Card[], out_problems: Problem[]) {
  const definedAddresses = new Set<number>();
  const unusedAddresses = new Map<number, ASTNode_NumberCard>();
  let wasPreviousOperationPerformed = false;
  const operationToPerform = {
    operationCard: null as ASTNode_OperationCard | null,
    variableCard_L1: null as ASTNode_VariableCard | null,
  };

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    switch (node.type) {
      case ASTNodeType.NumberCard:
        if (definedAddresses.has(node.address)) {
          out_problems.push(
            multipleDefinitions(node.address, node.ln, node.col, node.col + 4),
          );
          break;
        }

        definedAddresses.add(node.address);
        unusedAddresses.set(node.address, node);
        break;
      case ASTNodeType.OperationCard:
        if (
          operationToPerform.operationCard &&
          operationToPerform.variableCard_L1
        ) {
          out_problems.push(
            operationOverrides(
              operationToPerform.operationCard.ln,
              node.ln,
              node.col,
              node.col + 1,
            ),
          );
          break;
        }

        operationToPerform.operationCard = node;
        break;
      case ASTNodeType.ActionCard:
        if (node.action === "P" && !wasPreviousOperationPerformed) {
          out_problems.push(
            noArithmeticOperationPerformedPrior(
              node.ln,
              node.col,
              node.col + 1,
            ),
          );
          break;
        }

        break;
      case ASTNodeType.CombinatorialCard:
        break;
      case ASTNodeType.VariableCard:
        if (!definedAddresses.has(node.address)) {
          out_problems.push(
            undefinedAddress(node.address, node.ln, node.col, node.col + 4),
          );
          break;
        }

        unusedAddresses.delete(node.address);

        switch (node.action) {
          case "L":
            if (operationToPerform.variableCard_L1 === null) {
              operationToPerform.variableCard_L1 = node;
            } else {
              // variableCard_L2
              if (
                !wasPreviousOperationPerformed &&
                !operationToPerform.operationCard
              ) {
                out_problems.push(
                  noOperationSet(node.ln, node.col, node.col + 4),
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
                  node.ln,
                  node.col,
                  node.col + 1,
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
}
