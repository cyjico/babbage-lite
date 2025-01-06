export const enum MillOperation {
  Add,
  Subtract,
  Multiply,
  Divide,
}

export interface Mill {
  operation: MillOperation | null;
  runUpLever: boolean;
  ingressAxis1: number;
  ingressAxis2: number;
  egressAxis: number;
}
