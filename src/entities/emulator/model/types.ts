import { ASTNode_OperationCard } from "../lib/parse";

export interface Mill {
  operation: ASTNode_OperationCard["operation"] | "";
  runUpLever: boolean;
  ingressAxis1: number;
  ingressAxis2: number;
  egressAxis: number;
}
