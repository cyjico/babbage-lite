import { CFG, CFGNode, CFGNode_ID } from "../createCFG";

export default function analyzeCFG(cfg: CFG) {
  const visited = new Set<CFGNode_ID>();
  let hasCycle = false;

  const stack: CFGNode_ID[] = [0];
  while (stack.length > 0) {
    const id = stack.pop()!;

    if (visited.has(id)) {
      hasCycle = true;
      break;
    }

    visited.add(id);

    const edges = cfg.get(id)!.edges;
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];

      // Assume condition will NOT be constant during runtime
      if (edge.condition === undefined) stack.push(edge.to);
    }
  }

  const unreachable = new Set<CFGNode>();
  for (const [id, node] of cfg) {
    if (!visited.has(id)) unreachable.add(node);
  }

  return [hasCycle, unreachable];
}
