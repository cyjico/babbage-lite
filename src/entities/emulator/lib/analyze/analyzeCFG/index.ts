import { CFG, CFGBlock_ID } from "../createCFG";

export default function analyzeCFG(cfg: CFG) {
  const visited = new Set<CFGBlock_ID>();
  const path = new Set<CFGBlock_ID>();
  const parent = new Map<CFGBlock_ID, CFGBlock_ID>();

  const unreachable = new Set(cfg.keys());
  let cycle: CFGBlock_ID[] = [];

  const stack: CFGBlock_ID[] = cfg.size > 0 ? [0] : [];
  while (stack.length > 0 && cycle.length === 0) {
    const id = stack[stack.length - 1];

    if (!visited.has(id)) {
      visited.add(id);
      path.add(id);
      unreachable.delete(id);

      const edges = cfg.get(id)!.edges;
      let hasUnvisitedChild = false;

      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        if (edge.condition !== undefined) continue;

        if (path.has(edge.to)) {
          // Cycle found! Reconstruct it
          cycle = [edge.to];
          let cur = id;
          while (cur !== edge.to) {
            cycle.push(cur);
            cur = parent.get(cur)!;
          }

          break;
        }

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
    path.delete(id);
  }

  return {
    unreachable,
    cycle,
  };
}
