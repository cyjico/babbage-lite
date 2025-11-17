import { CFG, CFGBlock_ID } from "../createCFG";

export default function analyzeCFG(cfg: CFG) {
  const visited = new Set<CFGBlock_ID>();
  const parent = new Map<CFGBlock_ID, CFGBlock_ID>();

  const unreachable = new Set(cfg.keys());

  const stack: CFGBlock_ID[] = cfg.size > 0 ? [0] : [];
  while (stack.length > 0) {
    const id = stack[stack.length - 1];

    if (!visited.has(id)) {
      visited.add(id);
      unreachable.delete(id);

      const edges = cfg.get(id)!.edges;

      let hasUnvisitedChild = false;
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];

        if (!visited.has(edge.to)) {
          parent.set(edge.to, id);
          stack.push(edge.to);
          hasUnvisitedChild = true;
        }
      }
      if (hasUnvisitedChild) continue;
    }

    // Only pop when no children left (effectively backtracking)
    stack.pop();
  }

  return {
    unreachable,
  };
}
